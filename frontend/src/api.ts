import axios, { AxiosRequestConfig } from 'axios';
import { getDatabase, ref, get } from "firebase/database";
import { auth } from './firebase';


const API_BASE_URL = "https://lcrserver-production.up.railway.app";
// const API_BASE_URL = "http://127.0.0.1:3000";

let BOT_USER_ID: string;
if (import.meta.env.VITE_BOT_USER_ID) {
  BOT_USER_ID = import.meta.env.VITE_BOT_USER_ID;
} else {
  throw new Error("VITE_BOT_USER_ID is not provided.");
}


interface Player {
  Name: string;
}

async function postData(url: string, data: any, authToken: string) {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  const response = await axios.post(url, data, config);
  if (response.status !== 200 || !response.data) {
    throw new Error('Failed to post data');
  }
  return response.data;
}

async function getData(url: string, authToken: string) {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  const response = await axios.get(url, config);
  if (response.status !== 200 || !response.data) {
    throw new Error('Failed to get data');
  }
  return response.data;
}

export async function createGame(players: Player[]) {
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }

  try {
    const authToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    const data = await postData(`${API_BASE_URL}/games`, players, authToken);
    console.log('createGame response:', data.gameID, data.lobbyCode, data.creator.Name);
    return data;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
}


export async function joinGame(lobbyCode: string, playerName: string) {
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }
  try {
    const authToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    const data = await postData(`${API_BASE_URL}/games/${lobbyCode}/join`, { Name: playerName }, authToken);
    console.log('joinGame response:', data);
    return data.gameID;
  } catch (error) {
    console.error('Error joining game:', error);
    throw new Error('Failed to join the game. Please try again.');
  } 
}

export async function addBotsToLobby(lobbyCode: string) {
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }
  try {
    const authToken = BOT_USER_ID
    const data = await postData(`${API_BASE_URL}/games/${lobbyCode}/addBots`,{lobbyCode}, authToken);
    console.log('joinGame response:', data);
    return data.gameID;
  } catch (error) {
    console.error('Error joining game:', error);
    throw new Error('Failed to join the game. Please try again.');
  } 
}


export async function startGame(lobbyCode: string) {
  const authToken = auth.currentUser?.uid;
  if (!authToken) {
    throw new Error('User not authenticated');
  }

  try {
    const gameData = await getData(`${API_BASE_URL}/games/${lobbyCode}`, authToken);

    if (gameData.Players.length < 3) {
      throw new Error('Not enough players to start the game');
    }

    const data = await postData(`${API_BASE_URL}/games/${lobbyCode}/start`, { lobbyCode }, authToken);
    return data.game;
  } catch (error) {
    console.error('Error starting game:', error);
    throw error;
  }
}

export async function getGame(gameID: string) {
  const authToken = auth.currentUser?.uid;
  if (!authToken) {
    throw new Error('User not authenticated');
  }

  try {
    const data = await getData(`${API_BASE_URL}/games/${gameID}`, authToken);
    return data.game;
  } catch (error) {
    console.error('Error getting game:', error);
    throw error;
  }
}

export async function takeTurn(gameID: string) {
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }
  try {
    const authToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    const data = await postData(`${API_BASE_URL}/games/${gameID}/turn`, { gameID }, authToken);
    console.log('takeTurn response:', data);
    return data.game;
  }
  catch (error) {
    console.error('Error taking turn:', error);
    throw error;
  }
}

export async function getAvailableGames() {
  const authToken = auth.currentUser?.uid;
  if (!authToken) {
    throw new Error('User not authenticated');
  }

  try {
    const data = await getData(`${API_BASE_URL}/availableGames`, authToken);
    return data.games;
  } catch (error) {
    console.error('Error getting available games:', error);
    throw error;
  }
}

export async function getPlayers(lobbyCode: string) {
  const authToken = auth.currentUser?.uid;
  if (!authToken) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/games/${lobbyCode}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200) {
      const gameData = response.data.game;
      return gameData.Players;
    } else {
      console.error('Failed to get players');
      return null;
    }
  } catch (error) {
    console.error('Error getting players:', error);
    return null;
  }
}

export const checkForDuplicateName = async (lobbyCode: string, name: string) => {
  const authToken = auth.currentUser?.uid;
  if (!authToken) {
    throw new Error('User not authenticated');
  }

  const db = getDatabase();
  const lobbyRef = ref(db, `games/${lobbyCode}`);
  const snapshot = await get(lobbyRef);

  if (snapshot.exists()) {
    const gameData = snapshot.val();
    return gameData.Players.some((player: Player) => player.Name === name);
  } else {
    return false;
  }
};

export async function getGameIdByLobbyCode(lobbyCode: string) {
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }

  try {
    const authToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    const response = await getData(`${API_BASE_URL}/games/id/${lobbyCode}`, authToken);
    console.log('getGameIdByLobbyCode response:', response.gameID);
    
    if (response.gameID) {
      return response.gameID;
    } else {
      throw new Error('Failed to retrieve the game ID. Please try again.');
    }
  } catch (error) {
    console.error('Error getting game ID:', error);
    throw error;
  }
}

export async function lobbyReady(lobbyCode: string, name: string) {
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }

  try {
    const authToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    const response = await postData(`${API_BASE_URL}/games/${lobbyCode}/players/${name}/ready`, { lobbyCode, name }, authToken);
    console.log('lobbyReady response:', response);
    return response;
  } catch (error) {
    console.error('Error setting lobby status:', error);
    throw error;
  }
}

export async function botLobbyReady(lobbyCode: string) {
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }
  try {
    const authToken = BOT_USER_ID
    const response = await postData(`${API_BASE_URL}/games/${lobbyCode}/setBotsReady`, { lobbyCode }, authToken);
    console.log('lobbyReady response:', response);
    return response;
  } catch (error) {
    console.error('Error setting lobby status:', error);
    throw error;
  }
}
