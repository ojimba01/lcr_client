import { useState, useEffect } from "react";
import { getGameIdByLobbyCode } from "./api";
import CreateGame from "./components/CreateGame";
import GameWaitingRoom from "./components/GameWaitingRoom";
import JoinGame from "./components/JoinGame";
import GameScreen from "./components/GameScreen";
import Navigation from "./components/Navigation";
import Demo from "./components/Demo";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import Login from "./components/Login";
import {
  Flex,
  Button,
  ButtonGroup,
  Heading,
  Text,
  Box,
} from "@chakra-ui/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import HowToPlay from "./components/HowToPlay";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        margin: 0,
        padding: 0,
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ChakraProvider>
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

    return (
      <GameWaitingRoom
        gameID={gameID}
        lobbyCode={lobbyCode}
        onGameStart={onGameStart}
      />
    );
  };

  const GameScreenWrapper = () => {
    const { lobbyCode } = useParams();
    const [gameID, setGameID] = useState("");

    useEffect(() => {
      const fetchGameID = async () => {
        const fetchedGameID = await getGameIdByLobbyCode(lobbyCode);
        setGameID(fetchedGameID);
      };
      fetchGameID();
    }, [lobbyCode]);

    if (!gameID) {
      return (
        <Text fontSize="1.2rem" color="#888" my={1}>
          Loading...
        </Text>
      );
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

  const DemoGameWrapper = () => {
    const navigate = useNavigate();
    const onGameCreated = (gameID: string | null, LobbyCode: string | null) => {
      console.log("onGameCreated: ", gameID, LobbyCode); // Added logging here
      if (gameID && LobbyCode) {
        navigate(`/game/${gameID}/${LobbyCode}/waiting`);
      }
    };

    return <Demo onGameCreated={onGameCreated} />;
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
  const LoginWrapper = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    if (user) {
      navigate("/");
    }
    return <Login />;
  };
  const HomeWrapper = () => {
    const { user } = useAuth();
    if (!user) {
      // simply redirect to login page
      return <LoginWrapper />;
    }
    return (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        p={5}
        width={["90%", "80%", "70%", "60%", "50%"]} // For responsive design
        height="55%"
        mx="auto" // For centering horizontally
      >
        <Box
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          p={5}
          w="100%"
          textAlign="center"
        >
          <Heading fontSize="4xl">Welcome to LCR Online!</Heading>
          <Text mt={8} fontSize={"xl"}>
            LCR, or Left Center Right, is a fun, fast-paced dice game that you
            won't be able to put down! Each game includes three LCR specialty
            dice, 24 chips and instructions. Players roll the dice to determine
            where they pass their chips. The last player with chips is the
            winner and wins the center pot.
          </Text>
          <ButtonGroup variant="outline" spacing="6" mt={5}>
            <Button as={Link} to="/create" colorScheme="teal">
              Create Game
            </Button>
            <Button as={Link} to="/join" colorScheme="green">
              Join Game
            </Button>
          </ButtonGroup>
        </Box>
        <Text fontSize="md" color="gray.600" mt={5}>
          Don't have any friends to play with? All good! Run the demo and play
          with bots!
        </Text>
        <ButtonGroup variant="outline" spacing="6" mt={5}>
          <Button as={Link} variant="outline" to="/demo" colorScheme="blue">
            Demo
          </Button>
        </ButtonGroup>
      </Flex>
    );
  };

  return (
    <Router>
      <Navigation />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        width={["100vw", null]}
        height={["100vh", null]}
        p={2}
      >
        <Routes>
          <Route path="/" element={<HomeWrapper />} />
          <Route path="/login" element={<LoginWrapper />} />
          {user && (
            <>
              <Route path="/create" element={<CreateGameWrapper />} />
              <Route path="/join" element={<JoinGameWrapper />} />
              <Route path="/demo" element={<DemoGameWrapper />} />
              <Route
                path="/game/:gameID/:lobbyCode/waiting"
                element={<GameWaitingRoomWrapper />}
              />
              <Route path="/play/:lobbyCode" element={<GameScreenWrapper />} />
            </>
          )}
        </Routes>
      </Flex>
    </Router>
  );
}
export default App;
