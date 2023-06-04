import React, { useEffect, useState } from 'react';
import { takeTurn } from '../api';
import { ref, onValue, DataSnapshot, off } from 'firebase/database';
import { database } from '../firebase'; 
import { Game, Player } from '../LCR'; // Import the interfaces
import { auth } from '../firebase';

interface GameScreenProps {
  lobbyCode: string;
  gameID: string;
}

const GameScreen: React.FC<GameScreenProps> = ({ lobbyCode, gameID }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const gameRef = ref(database, `games/${gameID}`);

    const handleDataChange = (snapshot: DataSnapshot) => {
      const updatedGame: Game = snapshot.val();
      setGame(updatedGame);
      setLoading(false);
    };

    onValue(gameRef, handleDataChange);

    return () => {
      off(gameRef, 'value', handleDataChange);
    };
  }, [lobbyCode, gameID]);

  const handleTakeTurn = async () => {
    try {
      await takeTurn(gameID);
    } catch (err) {
      console.error('Error taking turn:', err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  const currentPlayer = game.Players[game.Turn];
  const isCurrentPlayerTurn = currentPlayer.UserID === auth.currentUser?.uid;
  const isButtonDisabled = !isCurrentPlayerTurn;

  return (
    <div>
      <h2>Game Screen</h2>
      <p>Pot: {game.Pot}</p>
      {game.Players.map((player: Player, index: number) => (
        <div
          key={index}
          style={{ outline: game.Turn === index ? '2px solid green' : 'none' }}
        >
          <p>Name: {player.Name}</p>
          <p>Chips: {player.Chips}</p>
        </div>
      ))}
      
      <button onClick={handleTakeTurn} disabled={isButtonDisabled}>
        Take Turn
      </button>
      <p>
        {/* It is Player: turn  player rolled these dice numbers*/}
        It is {game.Players[game.Turn].Name}'s turn. The previous player rolled these dice numbers:  
        {game.Dice.Rolls ? (
          game.Dice.Rolls.map((roll: number, index: number) => (
            <span key={index}>{roll} </span>
          ))
        ) : (
          <span>No dice roll numbers available.</span>
        )}
      </p>
    </div>
  );
};

export default GameScreen;
