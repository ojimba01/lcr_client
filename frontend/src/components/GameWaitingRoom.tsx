import React, { useEffect, useState } from 'react';
import { ref, onValue, off, get, update } from 'firebase/database';
import { auth } from '../firebase.ts'; // import from separate file
import { database } from '../firebase.ts'; // import from separate file
import { Game, Player } from '../LCR.ts'; // import from separate file
import { lobbyReady } from '../api.ts'; // import from separate file
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

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
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red.500">Error: {error}</Text>;
  }

  if (!game) {
    return <Text>Game not found</Text>;
  }

  const readyPlayersCount = game.Players?.filter((player) => player.LobbyStatus).length || 0;

  return (
    <VStack spacing={5} width="100%">
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" w="100%">
        <Heading fontSize="xl">Game Waiting Room</Heading>
        <Text>Lobby Code: {game.LobbyCode}</Text>
        <Text>Number of Players: {game.Players?.length || 0}</Text>
        <Text>Players Ready: {readyPlayersCount}/{game.Players?.length || 0}</Text>
        {auth.currentUser?.uid && (
          <Button
            colorScheme="blue"
            isDisabled={!game.Players || game.Players.length < 3 || !game.Players.every((player) => player.LobbyStatus)}
            onClick={handleGameStart}
          >
            Start Game
          </Button>
        )}
      </Box>
      {game.Players?.map((player: Player) => (
        <Box key={player.Name} p={5} shadow="md" borderWidth="1px" borderRadius="md" w="100%">
          <Text>{player.Name}: {player.LobbyStatus ? 'Ready' : 'Not Ready'}</Text>
          {player.UserID === auth.currentUser?.uid && !player.LobbyStatus && (
            <Button colorScheme="green" onClick={() => handleReadyUp(player.Name)}>Ready Up</Button>
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default GameWaitingRoom;