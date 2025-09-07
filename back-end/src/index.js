import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import wordRoutes from './routes/wordRoutes.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', wordRoutes);

app.listen(5000, () => console.log('Backend rodando na porta 5000'));