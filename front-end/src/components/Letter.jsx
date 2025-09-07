import { useContext, useEffect } from "react";
import { AppContext } from "../App";

function Letter({ letterPos, attemptVal }) {
  const { board, todaysWord, currentAttempt, setDisabledLetters } = useContext(AppContext);
  const letter = board[attemptVal][letterPos];

  let letterState = "";

  if (currentAttempt.attempt > attemptVal) {
    const wordArray = todaysWord.toUpperCase().split("");

    if (letter === wordArray[letterPos]) {
      letterState = "correct";
      wordArray[letterPos] = null;
    } else if (letter !== "" && wordArray.includes(letter)) {
      const index = wordArray.indexOf(letter);
      letterState = "almost";
      wordArray[index] = null;
    } else {
      letterState = "error";
    }
  }

  useEffect(() => {
    if (letter !== "" && letterState === "error") {
      setDisabledLetters((prev) => [...prev, letter]);
    }
  }, [currentAttempt.attempt]);

  return <div className="letter" id={letterState}>{letter}</div>;
}

export default Letter;
