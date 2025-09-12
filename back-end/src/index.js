import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import wordRoutes from './routes/wordRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API Wordle rodando 🚀");
});

app.use('/api', wordRoutes);

app.listen(PORT, () => console.log('Backend rodando na porta 5000'));