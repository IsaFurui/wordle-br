import React, { useContext } from 'react'
import { AppContext } from '../App'

function GameOver() {
    const { gameOver, currentAttempt, todaysWord } = useContext(AppContext);

    return (
        <div className="gameOver">
            <h3 className={gameOver.guessedWord ? "guessed" : ""}>{gameOver.guessedWord ? "Você acertou!" : "Você errou!"}</h3>
            <h1>Correct: { todaysWord.toUpperCase() }</h1>
            {gameOver.guessedWord && (
                <h3>Você acertou em {currentAttempt.attempt} tentativas!</h3>
            )}
            <button className='btnJogar' onClick={() => window.location.reload()}>Jogar novamente</button>
        </div>
    )
}

export default GameOver