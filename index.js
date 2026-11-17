import express from 'express';
import 'dotenv/config'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';
import Stripe from 'stripe'
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;




const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}

const mongoConnection = await connectToMongoDB()
const database = mongoConnection.db("jobglow");
const users = database.collection('user')
const jobs = database.collection('jobs')
const applications = database.collection('applications')
const payments = database.collection('payments')
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', async(req,res)=>{
    const cursor = users.find({})
    const result = await cursor.toArray()
    res.send(result)
})
app.patch('/users/:id/role', async(req,res)=>{
    const { id } = req.params
    const { role } = req.body ?? {}

    if (!['seeker', 'recruiter', 'admin'].includes(role)) {
        return res.status(400).send({ message: 'Invalid role.' })
    }

    if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid user id.' })
    }

    const user = await users.findOne(
        { _id: new ObjectId(id) },
        { projection: { role: 1 } }
    )

    if (!user) {
        return res.status(404).send({ message: 'User not found.' })
    }

    // Leave updatedAt alone when the role already matches so modifiedCount
    // still tells the client whether anything actually changed.
    if (user.role === role) {
        return res.send({
            acknowledged: true,
            modifiedCount: 0,
            matchedCount: 1,
        })
    }

    const result = await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role, updatedAt: new Date() } }
    )

    res.send(result)
})
app.get('/users/:id/premium', async (req, res) => {
    const id = req.params.id
    const query = { _id: new ObjectId(id) }
    const result = await users.findOne(query, { projection: { premium: 1 } })
    res.send(result)
})

// Jobs related APIs
app.get('/jobs', async (req, res) => {
    const query = {}
    console.log('query: ', req.query)

    if (req.query.jobType) {
        query.jobType = req.query.jobType
    }

    if (req.query.isRemote) {
        query.isRemote = req.query.isRemote === 'true'
    }
    if (req.query.category) {
        query.category = req.query.category
    }
    if (req.query.recruiterId) {
        query.recruiterId = req.query.recruiterId
    }
    if (req.query.search) {
        query.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { company: { $regex: req.query.search, $options: 'i' } },
            { responsibilities: { $regex: req.query.search, $options: 'i' } },
            { qualifications: { $regex: req.query.search, $options: 'i' } }
        ]
    }

    const result = await jobs.find(query).toArray()
    res.send(result)
})

app.get('/jobs/:id', async (req, res) => {
    const id = req.params.id
    const query = { _id: new ObjectId(id) }
    const result = await jobs.findOne(query)
    res.send(result)
})
app.post('/jobs', async (req, res) => {
    const job = req.body
    const result = await jobs.insertOne(job)
    res.send(result)
})

app.delete('/jobs/:id', async (req, res) => {
    const id = req.params.id
    const query = {
        _id: new ObjectId(id)
    }
    const result = await jobs.deleteOne(query)
    res.send(result)
})



// Applications related APIs
app.get('/applications', async (req, res) => {
    const query = {}
    if (req.query.applicantId) {
        query.userId = req.query.applicantId
    }
    if (req.query.jobId) {
        query.jobId = req.query.jobId
    }
    const cursor = applications.find(query)
    const result = await cursor.toArray()
    res.send(result)
})

app.get('/applications/count', async (req, res) => {
    const query = {}
    if (req.query.applicantId) {
        query.userId = req.query.applicantId
    }
    const result = await applications.countDocuments(query)
    res.send({ count: result })
})

app.post('/applications', async (req, res) => {
    const application = req.body
    const result = await applications.insertOne(application)
    res.send(result)
})

const APPLICATION_STATUSES = [
    'applied',
    'review',
    'shortlisted',
    'interview',
    'offered',
    'rejected',
    'withdrawn',
]

// Update the workflow status of one application.
app.patch('/applications/:id', async (req, res) => {
    const { id } = req.params
    const { status } = req.body ?? {}

    if (!APPLICATION_STATUSES.includes(status)) {
        return res.status(400).send({
            message: `status must be one of: ${APPLICATION_STATUSES.join(', ')}`,
        })
    }
    if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid application id' })
    }

    const result = await applications.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date().toISOString() } }
    )

    if (result.matchedCount === 0) {
        return res.status(404).send({ message: 'Application not found' })
    }

    res.send(result)
})
// Payments related APIs
app.post('/payments/checkout-verify', async (req, res) => {
    const { sessionId } = req.body
    if (!sessionId) {
        return res.send({ success: false, message: 'Session ID is required' })
    }
    const {
        status,
        payment_status,
        customer_email,
        metadata,
        payment_intent,
    } = await stripe.checkout.sessions.retrieve(sessionId)

    if (status === 'complete' && payment_status === 'paid') {
        const sessionQuery = { sessionId }
        const existingPayment = await payments.findOne(sessionQuery)
        if (existingPayment) {
            return res.send({ success: false, message: 'Payment already verified' })
        }
        const payment = {
            sessionId,
            status,
            payment_status,
            customer_email,
            userId: metadata.userId,
            payment_intent,
            payment_date: new Date()
        }

        const result = await payments.insertOne(payment)

        const query = { _id: new ObjectId(metadata.userId) }

        const updatedDoc = {
            $set: {
                premium: true
            }
        }
        const updatedResult = await users.updateOne(
            query,
            updatedDoc
        )
        res.send({ success: true, result, updatedResult })
        return
    }
    res.send({ success: false, message: 'Verification Failed' })

})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;