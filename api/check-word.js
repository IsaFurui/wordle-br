import fs from 'fs';
import { GoogleGenAI } from "@google/genai";

const WORD_FILE = './src/wordle-bank.txt';
const model = "gemini-2.5-flash";

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateAnswer(word) {
  const prompt = `
     Preciso saber se determinada palavra existe no dicionário do português do BR. Caso exista, quero somente que você responda com SIM, caso contrário, basta apenas responder NAO.

     A palavra que você precisa responder para mim se existe no português do Brasil é:
     ${word}

     INSTRUÇÕES
     - Apenas responda com SIM ou NAO se a palavra existe ou não;
     - Seja objetivo, fale apenas SIM ou NAO;
     - Desconsidere os acentos das palavras. Por exemplo: se for enviado a palavra labio, esta é uma palavra válida mesmo que lábio esteja sem acento.
  `.trim();
  const response = await gemini.models.generateContent({ model, contents: [{ text: prompt }] });
  if (!response.text) throw new Error("Falha ao gerar resposta pelo Gemini");
  return response.text;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { word } = req.body;
  const words = fs.readFileSync(WORD_FILE, 'utf8').split('\n').map(w => w.trim().toLowerCase());

  if (words.includes(word.toLowerCase())) {
    return res.json({ status: false, msg: "Palavra já está presente no banco de palavras", code: "exists" });
  }

  const response = await generateAnswer(word);

  if(response === 'NAO') {
    return res.json({ status: false, msg: "Palavra inválida", code: "invalid" });
  }

  fs.appendFileSync(WORD_FILE, `\n${word.toLowerCase()}`);
  return res.json({ status: true, msg: "Palavra adicionada com sucesso!", code: "added" });
}
