import { createContext, useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { boardDefault, generateWordSet } from "./words";
import GameOver from "./components/GameOver";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

function App() {
  // Vai mudar os elementos da matriz
  const [board, setBoard] = useState(boardDefault);
  // Objeto que vai conter a tentativa que o user está e a posição da letra onde ele se encontra
  const [currentAttempt, setCurrentAttempt] = useState({
    attempt: 0,
    letterPos: 0,
  });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  const [todaysWord, setTodaysWord] = useState("")

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setTodaysWord(words.todaysWord)
    });
  }, []);
  
  const onSelectLetter = (keyVal) => {
    if (currentAttempt.letterPos > 4) return; // Se a posição da letra for 5, ou seja, não tem mais letra para colocar, ele não faz nada.
    const newBoard = [...board]; // Espalha os elementos do array
    newBoard[currentAttempt.attempt][currentAttempt.letterPos] = keyVal; // Seta o valor da letra para o elemento correspondente da matriz
    setBoard(newBoard); // Atualiza
    setCurrentAttempt({
      ...currentAttempt,
      letterPos: currentAttempt.letterPos + 1,
    }); // Atualiza a posição da letra +1
  };

  const onEnter = async () => {
    if (currentAttempt.letterPos !== 5) return; // Se não tiver na posição 5

    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += board[currentAttempt.attempt][i];
    }

    currWord = currWord.toLowerCase();

    if (!wordSet.has(currWord)) {
      try {
        const res = await fetch('/api/check-word', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word: currWord }),
        });
        const data = await res.json();
        console.log(data)

        if (data.code === 'invalid') {
          toast.error(data.msg);
          return;
        }

        setWordSet(prev => new Set(prev).add(currWord));

      } catch (error) {
        console.error(error);
        toast.error("Erro ao consultar a palavra");
        return;
      }
    }

    setCurrentAttempt({ attempt: currentAttempt.attempt + 1, letterPos: 0 });

    if (currWord.toLowerCase() === todaysWord.toLowerCase()) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }

    if (currentAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
      return;
    }
  };

  const onDelete = () => {
    if (currentAttempt.letterPos === 0) return;
    const newBoard = [...board];
    newBoard[currentAttempt.attempt][currentAttempt.letterPos - 1] = ""; // Volta 1 posição e limpa visualmente a letra
    setBoard(newBoard);
    setCurrentAttempt({
      ...currentAttempt,
      letterPos: currentAttempt.letterPos - 1,
    }); // Retorna para a posição da letra anterior
  };

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <nav>
        <h1>Wordle</h1>
      </nav>
      <AppContext.Provider
        value={{
          board,
          setBoard,
          currentAttempt,
          setCurrentAttempt,
          onSelectLetter,
          onDelete,
          onEnter,
          todaysWord,
          disabledLetters,
          setDisabledLetters,
          setGameOver,
          gameOver
        }}
      >
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
