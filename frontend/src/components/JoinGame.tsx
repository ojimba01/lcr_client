import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { joinGame } from "../api";

interface JoinGameProps {
  onGameJoined: (
    gameID: string | null,
    LobbyCode: string | null,
    name: string | null
  ) => void;
}

const JoinGame: React.FC<JoinGameProps> = ({ onGameJoined }) => {
  const [lobbyCode, setLobbyCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Update the handleSubmit function in the joinGame component
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lobbyCode.trim()) {
      setErrorMsg("Please enter the lobby code.");
      return;
    }

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    try {
      const gameID = await joinGame(lobbyCode, name);
      if (gameID === null) {
        setErrorMsg("Failed to join the game. Please try again.");
        return;
      }
      console.log("JoinGame", gameID, lobbyCode, name);
      onGameJoined(gameID, lobbyCode, name);
    } catch (err) {
      console.error("Error joining game:", err);
      onGameJoined(null, null, null);
      setErrorMsg(
        "Error joining game. Please check your name/lobby code inputs and try again."
      );
    }
  };

  return (
    <Box
      as="form"
      p={5}
      borderRadius="md"
      boxShadow="md"
      onSubmit={handleSubmit}
    >
      <FormControl id="lobbyCode" mb={4}>
        <FormLabel>Lobby Code</FormLabel>
        <Input
          type="text"
          value={lobbyCode}
          onChange={(e) => setLobbyCode(e.target.value)}
          isRequired
        />
      </FormControl>
      <FormControl id="name" mb={4}>
        <FormLabel>Your Name</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired
        />
      </FormControl>
      <Button type="submit" colorScheme="teal">
        Join Game
      </Button>
      {errorMsg && (
        <Text color="red.500" mt={4}>
          {errorMsg}
        </Text>
      )}
    </Box>
  );
};

export default JoinGame;
