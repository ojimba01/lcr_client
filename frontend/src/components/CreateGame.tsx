import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect, FormEvent } from "react";
import { auth } from "../firebase";
import { createGame } from "../api";
import { Player } from "./lcr";
interface CreateGameProps {
  onGameCreated: (
    gameID: string | null,
    lobbyCode: string | null,
    name: string | null
  ) => void;
}

const CreateGame: React.FC<CreateGameProps> = ({ onGameCreated }) => {
  const [name, setName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const playerName = localStorage.getItem("playerName");
    if (playerName) {
      setName(playerName);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    try {
      localStorage.setItem("playerName", name);

      const player: Player = { Name: name, Chips: 3 };
      console.log("CreateGame", player, auth.currentUser?.uid);
      const response = await createGame([player]);
      console.log(response);

      if (response.gameID) {
        console.log(
          "Game created:",
          response.gameID,
          response.creator.Name,
          response.lobbyCode
        );
        onGameCreated(
          response.gameID,
          response.lobbyCode,
          response.creator.Name
        );
      } else {
        setErrorMessage(
          "Failed to create the game. Please try again." + response
        );
      }
    } catch (err) {
      console.error("Error creating game:", err);
      onGameCreated(null, null, null);
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
      <FormControl id="name" mb={4}>
        <FormLabel>Your Name</FormLabel>
        <Input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired
        />
      </FormControl>
      <Button type="submit" colorScheme="teal">
        Create Game
      </Button>
      {errorMessage && (
        <Text color="red.500" mt={4}>
          {errorMessage}
        </Text>
      )}
    </Box>
  );
};

export default CreateGame;
