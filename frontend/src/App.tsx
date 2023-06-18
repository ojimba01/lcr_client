import { useState, useEffect, useRef } from "react";
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
import { TitleHeader } from "./components/Title";

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
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);

  const GameWaitingRoomWrapper = () => {
    const { gameID, lobbyCode } = useParams();
    const navigate = useNavigate();

    const onGameStart = (lobbyCode: string) => {
      navigate(`/play/${lobbyCode}`);
    };

    return (
      <Box
        display="flex"
        height="75vh" // This will make sure the container takes the full height of the viewport
        w="90%"
        maxW="800px"
      >
        <GameWaitingRoom
          gameID={gameID}
          lobbyCode={lobbyCode}
          onGameStart={onGameStart}
        />
      </Box>
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

    return (
      <Box
        display="flex"
        height="75vh" // This will make sure the container takes the full height of the viewport
        w="90%"
        maxW="800px"
      >
        <GameScreen gameID={gameID} lobbyCode={lobbyCode} />
      </Box>
    );
  };

  const CreateGameWrapper = () => {
    const navigate = useNavigate();
    const onGameCreated = (gameID: string | null, LobbyCode: string | null) => {
      console.log("onGameCreated: ", gameID, LobbyCode); // Added logging here
      if (gameID && LobbyCode) {
        navigate(`/game/${gameID}/${LobbyCode}/waiting`);
      }
    };

    return (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        textAlign={"center"}
        height="65vh" // This will make sure the container takes the full height of the viewport
      >
        <CreateGame onGameCreated={onGameCreated} />;
      </Flex>
    );
  };

  const DemoGameWrapper = () => {
    const navigate = useNavigate();
    const onGameCreated = (gameID: string | null, LobbyCode: string | null) => {
      console.log("onGameCreated: ", gameID, LobbyCode); // Added logging here
      if (gameID && LobbyCode) {
        navigate(`/game/${gameID}/${LobbyCode}/waiting`);
      }
    };

    return (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        textAlign={"center"}
        height="65vh" // This will make sure the container takes the full height of the viewport
      >
        <Demo onGameCreated={onGameCreated} />
      </Flex>
    );
  };

  const JoinGameWrapper = () => {
    const navigate = useNavigate();
    const onGameJoined = async (gameID: string, LobbyCode: string) => {
      if (LobbyCode) {
        navigate(`/game/${gameID}/${LobbyCode}/waiting`);
      }
    };

    return (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        textAlign={"center"}
        height="65vh" // This will make sure the container takes the full height of the viewport
      >
        <JoinGame onGameJoined={onGameJoined} />
      </Flex>
    );
  };

  const LoginWrapper = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        navigate("/");
      }
    }, [user, navigate]);

    return (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        height="65vh" // This will make sure the container takes the full height of the viewport
      >
        <TitleHeader />
        <Login />
      </Flex>
    );
  };

  const HomeWrapper = () => {
    const { user } = useAuth();
    if (!user) {
      // edirect to login page
      return <LoginWrapper />;
    }
    return (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        textAlign={"center"}
        mt={-5}
        width={["90%", "80%", "70%", "60%", "50%"]} // For responsive design
        height="70%"
        mx="auto" // For centering horizontally
      >
        <Box marginTop={`${navHeight}px`}>
          <TitleHeader />
        </Box>

        <Box
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          mt={10}
          p={5}
          w="100%"
          textAlign="center"
        >
          <Text mt={8} mb={4} fontSize={"xl"}>
            LCR, or Left Center Right, is a multiplayer emulated version of the
            classic board game. It's a fun, fast-paced dice game that you won't
            be able to put down! Join other players from around the world and
            compete to see who's the best! If you're interested in learning more
            about the project, you can check out the source code on GitHub by
            clicking the title above this card component.
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
      <Navigation navRef={navRef} />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        // textAlign="center"
        align="center"
        width={["100vw", null]}
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
