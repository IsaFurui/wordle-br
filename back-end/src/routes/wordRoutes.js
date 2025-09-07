import express from 'express';
import { checkAndAddWord } from '../services/wordService.js';

const router = express.Router();

router.post('/check-word', async (req, res) => {
  try {
    const { word } = req.body;
    const result = await checkAndAddWord(word);
    return res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "Erro no servidor", code: "server_error" });
  }
});

export default router;
