import React, { useEffect, useState } from 'react';
import { ref, onValue, off, get, update } from 'firebase/database';
import { auth } from '../firebase.ts'; // import from separate file
import { database } from '../firebase.ts'; // import from separate file
import { Game, Player } from '../LCR.ts'; // import from separate file
import { lobbyReady } from '../api.ts'; // import from separate file

interface GameWaitingRoomProps {
  gameID: string;
  lobbyCode: string;
  onGameStart: (lobbyCode: string) => void; // Add parameter here
}

const GameWaitingRoom: React.FC<GameWaitingRoomProps> = ({ gameID, lobbyCode, onGameStart }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log('GameWaitingRoom', gameID, lobbyCode);

  useEffect(() => {
    const lobbyRef = ref(database, `games/${gameID}`);

    const fetchData = async () => {
      try {
        const snapshot = await get(lobbyRef);
        const initialGame = snapshot.val();
        setGame(initialGame);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching game:', err);
        setLoading(false);
        setError(err.message);
      }
    };

    fetchData();

    const registration = onValue(lobbyRef, (snapshot) => {
      const updatedGame = snapshot.val();
      setGame(updatedGame);

      if (updatedGame.isGameStarted) {
        onGameStart(updatedGame.LobbyCode);
      }
    });

    return () => {
      off(lobbyRef, 'value', registration); // Unsubscribe from the database updates when the component unmounts
    };
  }, [gameID, onGameStart]);

  const handleReadyUp = async (name: string) => {
    try {
      await lobbyReady(game.LobbyCode, name);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGameStart = async () => {
    if (game?.Players?.every((player) => player.LobbyStatus)) {
      try {
        // Push the game start status to your database
        await update(ref(database, `games/${gameID}`), { isGameStarted: true });
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError('Not all players are ready yet');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // consider using a spinner or more user-friendly loading indication
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!game) {
    console.log('Game not found', game);
    return <div>Game not found</div>;
  }

  // Get the count of players who are ready
  const readyPlayersCount = game.Players?.filter((player) => player.LobbyStatus).length || 0;

  return (
    <div>
      <h2>Game Waiting Room</h2>
      <p>Lobby Code: {game.LobbyCode}</p>
      <p>Number of Players: {game.Players?.length || 0}</p>
      <p>Players Ready: {readyPlayersCount}/{game.Players?.length || 0}</p>
      {game.Players?.map((player: Player) => (
        <div key={player.Name}>
          {player.UserID === auth.currentUser?.uid && (
            <div>
              <span>{player.Name}: {player.LobbyStatus ? 'Ready' : 'Not Ready'}</span>
              {!player.LobbyStatus && (
                <button onClick={() => handleReadyUp(player.Name)}>Ready Up</button>
              )}
            </div>
          )}
        </div>
      ))}
      {auth.currentUser?.uid && (
        <button
          disabled={!game.Players || game.Players.length < 3 || !game.Players.every((player) => player.LobbyStatus)}
          onClick={handleGameStart}
        >
          Start Game
        </button>
      )}
      <p>Other Game Data Here...</p>
    </div>
  );
};

export default GameWaitingRoom;
