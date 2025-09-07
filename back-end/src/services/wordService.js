import { generateAnswer } from "../utils/gemini.js";
import fs from 'fs';

const WORD_FILE = './src/wordle-bank.txt';

export async function checkAndAddWord(word) {
    const words = fs.readFileSync(WORD_FILE, 'utf8').split('\n').map(w => w.trim().toLowerCase());

    if (words.includes(word.toLowerCase())) {
        return { status: false, msg: "Palavra já está presente no banco de palavras", code: "exists" };
    }

    const response = await generateAnswer(word);
    console.log('response', response)

    if(response === 'NAO') {
        return { status: false, msg: "Palavra inválida", code: "invalid" };
    }

    fs.appendFileSync(WORD_FILE, `\n${word.toLowerCase()}`);
    return { status: true, msg: "Palavra adicionada com sucesso!", code: "added" };
}