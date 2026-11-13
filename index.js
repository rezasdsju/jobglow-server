import express from 'express';
import 'dotenv/config'
import cors from 'cors'
import { MongoClient } from 'mongodb';

const app = express();

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
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// app.get('/users', async(req,res)=>{
//     const cursor = users.find({})
//     const result = await cursor.toArray()
//     res.send(result)
// })

// Jobs related APIs
app.get('/jobs', async(req,res)=>{
    const cursor = jobs.find({})
    const result = await cursor.toArray()
    res.send(result)
})
app.post('/jobs', async(req,res)=>{
    const job = req.body
    const result = await jobs.insertOne(job)
    res.send(result)
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;