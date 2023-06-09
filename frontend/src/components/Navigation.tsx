import {
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "./AuthProvider";
import { Link as RouterLink } from "react-router-dom";
import { SideBar } from "./SideBar";
import HowToPlay from "./HowToPlay";

function AuthenticatedLinks() {
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

function HowToPlayWrapper() {
  const auth = useAuth();
  const user = auth?.user; // Add a conditional check

  if (!user) {
    return null; // or render a loading spinner or a placeholder
  }

  return <>{user && <HowToPlay />}</>;
}

const Navigation = ({ navRef }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      as="nav"
      bg="teal.500"
      color="white"
      align="center"
      justify="space-between"
      padding=".5rem"
      position="sticky"
      w="100vw"
      zIndex="1"
      ref={navRef} // attach the ref here
      mb={4} // Add a bottom margin
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
        <AuthenticatedLinks />
      </Box>
      <SideBar isOpen={isOpen} onClose={onClose} />
      <Box display={{ base: "block", md: "none" }}>
        <HowToPlayWrapper />
      </Box>
    </Flex>
  );
};

export default Navigation;
