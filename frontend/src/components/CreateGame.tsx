import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createGame } from '../api';

interface CreateGameProps {
  onGameCreated: (gameID: string | null, LobbyCode: string | null, name: string | null) => void;
}

const CreateGame: React.FC<CreateGameProps> = ({ onGameCreated }) => {
  const [name, setName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const playerName = localStorage.getItem('playerName');
    if (playerName) {
      setName(playerName);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    try {
      localStorage.setItem('playerName', name);

      const player = { Name: name, Chips: 3 };
      console.log('CreateGame', player, auth.currentUser?.uid);
      const response= await createGame([player]);
      console.log(response);

      if (response.gameID) {
        console.log('Game created:', response.gameID, response.creator.Name, response.lobbyCode);
        onGameCreated(response.gameID, response.lobbyCode, response.creator.Name, );

      
      } else {
        setErrorMessage('Failed to create the game. Please try again.' + response);
      }
    } catch (err) {
      console.error('Error creating game:', err);
      onGameCreated(null, null, null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Create Game</button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default CreateGame;
