import React, { useEffect, useState } from "react";
import { ref, onValue, off, get, update } from "firebase/database";
import { auth } from "../firebase"; // import from separate file
import { database } from "../firebase"; // import from separate file
import { Game, Player } from "./lcr"; // import from separate file
import { lobbyReady, botLobbyReady } from "../api"; // import from separate file
import { Box, Button, Heading, Text, Flex } from "@chakra-ui/react";

interface GameWaitingRoomProps {
  gameID: string;
  lobbyCode: string;
  onGameStart: (lobbyCode: string) => void; // Add parameter here
}

const GameWaitingRoom: React.FC<GameWaitingRoomProps> = ({
  gameID,
  lobbyCode,
  onGameStart,
}) => {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log("GameWaitingRoom", gameID, lobbyCode);

  useEffect(() => {
    const lobbyRef = ref(database, `games/${gameID}`);

    const fetchData = async () => {
      try {
        const snapshot = await get(lobbyRef);
        const initialGame = snapshot.val();
        setGame(initialGame);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching game:", err);
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
      off(lobbyRef, "value", registration); // Unsubscribe from the database updates when the component unmounts
    };
  }, [gameID, onGameStart]);

  const handleReadyUp = async (name: string) => {
    try {
      // Check if the bot is in the game
      const botIsInGame = game.Players.some(
        (player) => player.UserID === "3XW4LgX0jMeo6mwTU9NrE0a2rYN2"
      );

      // If the bot is in the game, set all players to ready. Otherwise, just set the current player to ready.
      if (botIsInGame) {
        await botLobbyReady(lobbyCode);
      } else {
        console.log("Bot", gameID, lobbyCode, name);
      }
      try {
        await lobbyReady(game.LobbyCode, name);
      } catch (error: any) {
        setError(error.message);
      }
      // ready
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGameStart = async () => {
    if (game?.Players?.every((player) => player.LobbyStatus)) {
      try {
        // Push the game start status to your database
        await update(ref(database, `games/${gameID}`), { isGameStarted: true });
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      setError("Not all players are ready yet");
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

  const readyPlayersCount =
    game.Players?.filter((player) => player.LobbyStatus).length || 0;

  return (
    <Box
      w="90%"
      maxW="800px"
      m="auto"
      p={5}
      borderRadius="md"
      bg="gray.50"
      boxShadow="md"
      textAlign={"center"}
      justifyContent={"center"}
    >
      <Heading mb={4}>Game Waiting Room</Heading>
      <Text mb={2}>Lobby Code: {game.LobbyCode}</Text>
      <Text mb={2}>Number of Players: {game.Players?.length || 0}</Text>
      <Text mb={2}>
        Players Ready: {readyPlayersCount}/{game.Players?.length || 0}
      </Text>
      {auth.currentUser?.uid && (
        <Button
          colorScheme="blue"
          isDisabled={
            !game.Players ||
            game.Players.length < 3 ||
            !game.Players.every((player) => player.LobbyStatus)
          }
          onClick={handleGameStart}
          mt={4}
        >
          Start Game
        </Button>
      )}
      {game.Players?.map((player: Player) => (
        <Box
          key={player.Name}
          p={1}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          textAlign={"center"}
          mt={4}
          mx="auto" // Center the player boxes
        >
          <Text>
            {player.Name}: {player.LobbyStatus ? "Ready" : "Not Ready"}
          </Text>
          {player.UserID === auth.currentUser?.uid && !player.LobbyStatus && (
            <Button
              colorScheme="green"
              onClick={() => handleReadyUp(player.Name)}
              mt={2}
            >
              Ready Up
            </Button>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default GameWaitingRoom;
