import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { takeTurn } from '../api';
import { ref, onValue, DataSnapshot, off } from 'firebase/database';
import { database } from '../firebase'; 
import { Game, Player } from '../LCR'; // Import the interfaces
import { auth } from '../firebase';
// import './GameScreen.css';
import {  Text, Button, Spinner } from '@chakra-ui/react';

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
  

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (!game) {
    return <Box>Game not found</Box>;
  }

  const currentPlayer = game.Players[game.Turn];
  const isCurrentPlayerTurn = currentPlayer.UserID === auth.currentUser?.uid;
  const isButtonDisabled = !isCurrentPlayerTurn;

  return (
    <Box
      w="90%"
      maxW="800px"
      m="auto"
      p={5}
      borderRadius="md"
      bg="gray.100"
      boxShadow="md"
    >
      <Text fontSize="2xl" fontWeight="bold" color="gray.700">
        Game Screen
      </Text>
      <Text fontSize="lg" color="gray.600">
        Pot: {game.Pot}
      </Text>
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
          It is {game.Players[game.Turn].Name}'s turn. The previous player rolled these dice numbers:  
          {game.Dice.Rolls ? (
            game.Dice.Rolls.map((roll: number, index: number) => (
              <span key={index}>{roll} </span>
            ))
          ) : (
            <span>No dice roll numbers available.</span>
          )}
        </Text>
      )}
    </Box>
  );
};

export default GameScreen;
