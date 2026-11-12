import express from 'express';
import 'dotenv/config'
import cors from 'cors'


const app = express();

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;