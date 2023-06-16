import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { takeTurn } from '../api';
import { ref, onValue, DataSnapshot, off } from 'firebase/database';
import { database } from '../firebase'; 
import { Game, Player } from './lcr'; // Import the interfaces
import { auth } from '../firebase';
// import './GameScreen.css';
import {  Text, Button, Spinner } from '@chakra-ui/react';

let BOT_USER_ID: string;
if (import.meta.env.VITE_BOT_USER_ID) {
  BOT_USER_ID = import.meta.env.VITE_BOT_USER_ID;
} else {
  throw new Error("VITE_BOT_USER_ID is not provided.");
}

interface GameScreenProps {
  lobbyCode: string;
  gameID: string;
}

const interpretRoll = (roll: number) => {
  switch (roll) {
    case 1:
    case 2:
    case 3:
      return '⚫';
    case 4:
      return 'L';
    case 5:
      return 'C';
    case 6:
      return 'R';
    default:
      return '';
  }
};

const GameScreen: React.FC<GameScreenProps> = ({ lobbyCode, gameID }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);

  const handleTakeTurn = async () => {
    try {
      setIsRolling(true);
      await takeTurn(gameID);
      setIsRolling(false);
    } catch (err) {
      console.error('Error taking turn:', err);
      setIsRolling(false);
    }
  };

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

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
  
    const currentPlayer = game?.Players[game?.Turn || 0];
    const isCurrentPlayerTurn = currentPlayer?.UserID === auth.currentUser?.uid;
    const botIsInGame = game?.Players.some(player => player.UserID === BOT_USER_ID) || false;
    const isGameFinished = Boolean(game?.Winner);
  
    if (!isCurrentPlayerTurn && botIsInGame && !isGameFinished) {
      intervalId = setInterval(() => {
        handleTakeTurn();
      }, 2000);
    }
  
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [game, handleTakeTurn]);
  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (!game) {
    return <Box>Game not found</Box>;
  }

  const currentPlayer = game.Players[game.Turn];
  const isCurrentPlayerTurn = currentPlayer.UserID === auth.currentUser?.uid;
  const isButtonDisabled = !isCurrentPlayerTurn || Boolean(game.Winner); // Disable the button if there's a Winner

  return (
    <Box
      w="90%"
      maxW="800px"
      m="auto"
      p={5}
      borderRadius="md"
      bg="gray.50"
      boxShadow="md"
    >
      <Text fontSize="2xl" fontWeight="bold" color="gray.700">
        Game Screen
      </Text>
      <Text fontSize="lg" color="gray.600">
        Pot: {game.Pot}
      </Text>
      {game.Winner && (
        <Text fontSize="lg" color="green.500">
          Winner: {game.Winner.Name}
        </Text>
      )}
      {game.Players.map((player: Player, index: number) => (
        <Box
          p={2}
          mb={5}
          borderRadius="md"
          bg={game.Turn === index ? 'green.100' : 'transparent'}
          key={index}
        >
          <Text fontSize="lg">Name: {player.Name}</Text>
          <Text fontSize="lg">Chips: {player.Chips}</Text>
        </Box>
      ))}
      
      <Button 
        onClick={handleTakeTurn} 
        isDisabled={isButtonDisabled} 
        w="100%" 
        py={2} 
        mt={5} 
        mb={2} 
        colorScheme="teal" 
        _disabled={{ bgColor: 'gray.300' }}
      >
        Take Turn
      </Button>
      {isRolling ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          color="red.500"
          size="xl"
        />
      ) : (
        <Text fontSize="lg">
  It is {game.Players[game.Turn].Name}'s turn. The previous player rolled the following:
  {game.Dice.Rolls ? (
    game.Dice.Rolls.map((roll: number, index: number) => (
      <span key={index}>{interpretRoll(roll)}</span>
    ))
  ) : (
    <span>No dice roll available.</span>
  )}
</Text>
      )}
    </Box>
  );
};

export default GameScreen;
