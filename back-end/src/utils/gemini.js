import { GoogleGenAI } from "@google/genai";

const model = "gemini-2.5-flash";

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateAnswer(word) {
  // Prompt que será enviado para o Gemini
  const prompt = `
     Preciso saber se determinada palavra existe no dicionário do português do BR. Caso exista, quero somente que você responda com SIM, caso contrário, basta apenas responder NAO.

     A palavra que você precisa responder para mim se existe no português do Brasil é:
     ${word}

     INSTRUÇÕES
     - Apenas responda com SIM ou NAO se a palavra existe ou não;
     - Seja objetivo, fale apenas SIM ou NAO;
     - Desconsidere os acentos das palavras. Por exemplo: se for enviado a palavra labio, esta é uma palavra válida mesmo que lábio esteja sem acento.
  `.trim(); // Trim remove os espaços em branco de um texto

  // Manda a requisição para a Gemini
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  // Se a req falhar, lança erro
  if (!response.text) {
    throw new Error("Falha ao gerar resposta pelo Gemini");
  }

  return response.text;
}