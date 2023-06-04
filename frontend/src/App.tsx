import { useState, useEffect } from 'react';
import { getGameIdByLobbyCode } from './api';
import './App.css';
import CreateGame from './components/CreateGame';
import GameWaitingRoom from './components/GameWaitingRoom';
import JoinGame from './components/JoinGame';
import GameScreen from './components/GameScreen';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { auth } from './firebase';
import Login from './components/Login';

function AuthenticatedLinks() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (user === null) {
    return null; // or render a loading spinner or a placeholder
  }

  return (
    <>
      {user && <Link to="/">Home</Link>}
      {user && <Link to="/create">Create Game</Link>}
      {user && <Link to="/join">Join Game</Link>}
      {user && <button onClick={handleLogout}>Logout</button>}
      {!user && <Link to="/login">Login</Link>}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  
  const GameWaitingRoomWrapper = () => {
    const { gameID, lobbyCode } = useParams();
    const navigate = useNavigate();

    const onGameStart = (lobbyCode: string) => {
      navigate(`/play/${lobbyCode}`);
    };

    return <GameWaitingRoom gameID={gameID} lobbyCode={lobbyCode} onGameStart={onGameStart} />;
  };

  const GameScreenWrapper = () => {
    const { lobbyCode } = useParams();
    const [gameID, setGameID] = useState('');

    useEffect(() => {
      const fetchGameID = async () => {
        const fetchedGameID = await getGameIdByLobbyCode(lobbyCode);
        setGameID(fetchedGameID);
      };
      fetchGameID();
    }, [lobbyCode]);

    if (!gameID) {
      return <div>Loading...</div>;
    }

    return <GameScreen gameID={gameID} lobbyCode={lobbyCode} />;
  };

  const CreateGameWrapper = () => {
    const navigate = useNavigate();
    const onGameCreated = (gameID: string | null, LobbyCode: string | null) => {
      console.log("onGameCreated: ", gameID, LobbyCode); // Added logging here
      if (gameID && LobbyCode) {
        navigate(`/game/${gameID}/${LobbyCode}/waiting`);
      }
    };

    return <CreateGame onGameCreated={onGameCreated} />;
  };

  const JoinGameWrapper = () => {
    const navigate = useNavigate();
    const onGameJoined = async (gameID: string, LobbyCode: string) => {
      if (LobbyCode) {
        navigate(`/game/${gameID}/${LobbyCode}/waiting`);
      }
    };

    return <JoinGame onGameJoined={onGameJoined} />;
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <AuthenticatedLinks />
        </nav>
        <Routes>
          {user ? (
            <>
              <Route path="/create" element={<CreateGameWrapper />} />
              <Route path="/join" element={<JoinGameWrapper />} />
              <Route
                path="/game/:gameID/:lobbyCode/waiting"
                element={<GameWaitingRoomWrapper />}
              />
              <Route path="/play/:lobbyCode" element={<GameScreenWrapper />} />
            </>
          ) : (
            <Route
              path="/"
              element={
                <div>
                  <Login />
                  <div>Welcome to the home page!</div>
                </div>
              }
            />
          )}
        </Routes>
      </div>
    </Router>
  );
}
export default App;
