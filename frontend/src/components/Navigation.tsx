import { Box, Button, Flex, IconButton, Link, Text, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon, QuestionIcon } from '@chakra-ui/icons';
import { useAuth } from './AuthProvider';
import { Link as RouterLink } from 'react-router-dom';
import SideBar from './SideBar';

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
      {user && (
        <Button as={RouterLink} to="/how-to-play" mr={2}>
          <QuestionIcon mr={2} />
          How To Play
        </Button>
      )}
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
          mr={3} // Add a right margin
        />

        <Link as={RouterLink} to="/">
          <Text fontSize="xl" fontWeight="bold">
            LCR
          </Text>
        </Link>
      </Flex>
      <Box display={{ base: "none", md: "flex" }}>
        <AuthenticatedLinks />
      </Box>
      <SideBar isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default Navigation;
