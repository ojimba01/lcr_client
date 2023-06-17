import {
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, QuestionIcon } from "@chakra-ui/icons";
import { useAuth } from "./AuthProvider";
import { Link as RouterLink } from "react-router-dom";
import { SideBar } from "./SideBar";
import HowToPlay from "./HowToPlay";

function AuthenticatedLinks({ onClose }: { onClose: () => void }) {
  const auth = useAuth();
  const user = auth?.user; // Add a conditional check

  const handleLogout = () => {
    auth.logout();
  };

  if (!user) {
    return null; // or render a loading spinner or a placeholder
  }

  return (
    <>
      {user && <HowToPlay />}
      {user && (
        <Button onClick={handleLogout} ml={4} mr={6}>
          Logout
        </Button>
      )}
    </>
  );
}

const Navigation: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      as="nav"
      bg="teal.500"
      color="white"
      align="center"
      justify="space-between"
      padding=".5rem"
      position="fixed"
      top="0"
      w="100vw"
      zIndex="1"
      mb={4}
    >
      <Flex>
        <IconButton
          aria-label="Open menu"
          display={{ base: "block", md: "none" }}
          onClick={onOpen}
          icon={<HamburgerIcon />}
          variant="outline"
          colorScheme="white"
          color={location.pathname === "/" ? "gray.200" : "white"}
          _hover={{ color: "gray.200", borderColor: "gray.200" }}
          _focus={{
            borderColor: "gray.200",
            boxShadow: "0 0 0 3px rgba(160, 160, 160, 0.6)",
          }}
          mr={3} // Add a right margin
        />

        <Link as={RouterLink} to="/" style={{ textDecoration: "none" }}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={location.pathname === "/" ? "gray.200" : "white"}
            _hover={{ color: "gray.200" }}
            _focus={{ color: "gray.200" }}
          >
            LCR
          </Text>
        </Link>
      </Flex>
      <Box display={{ base: "none", md: "flex" }}>
        <AuthenticatedLinks onClose={onClose} />
      </Box>
      <SideBar isOpen={isOpen} onClose={onClose} />
      <Box display={{ base: "block", md: "none" }}>
        <HowToPlay />
      </Box>
    </Flex>
  );
};

export default Navigation;
