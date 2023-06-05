// Navigation.tsx
import { Box, Button, Flex, IconButton, Link, Text, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import {QuestionIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useAuth } from './AuthProvider';
import { Link as RouterLink } from 'react-router-dom';
import SideBar from './SideBar.tsx';


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
      {user && <Link as={RouterLink} to="/how-to-play"><QuestionIcon mr={2} />How To Play</Link>}
      {user && <Button onClick={handleLogout}><ArrowForwardIcon mr={2} />Logout</Button>}
    </>
  );
}
const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex as="nav" bg="teal.500" color="white" align="center" justify="space-between" padding="1.5rem" position="fixed" top="0" w="100vw" zIndex="1">
      <Flex>
        <IconButton 
          aria-label="Open menu" 
          display={{ base: "block", md: "none" }}
          onClick={onOpen}
          icon={<HamburgerIcon />} 
          variant="outline" 
          colorScheme="white"
          mr={3}  // Add a right margin
        />

        <Link as={RouterLink} to="/"> 
          <Text fontSize="xl" fontWeight="bold">LCR</Text>
        </Link>
      </Flex>
      <Box display={{ base: "none", md: "flex" }} >
        <AuthenticatedLinks />
      </Box>
      <SideBar isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default Navigation;
