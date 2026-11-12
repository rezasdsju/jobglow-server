import express from 'express';
import 'dotenv/config'
import cors from 'cors'


const app = express();

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;


import { MongoClient } from 'mongodb';

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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;