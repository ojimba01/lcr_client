// SideBar.tsx
import React from 'react';
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, Link, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { AddIcon, ExternalLinkIcon, ArrowForwardIcon, UnlockIcon, QuestionIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';


function AuthenticatedLinks({onClose}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  if (user === null) {
    return null; // or render a loading spinner or a placeholder
  }

  return (
    <VStack spacing="1rem" align="start">
      {user && <Link as={RouterLink} to="/how-to-play"><QuestionIcon mr={2}/>How To Play</Link>}
      {user && <Link as={RouterLink} to="/create"><AddIcon mr={2} />Create Game</Link>}
      {user && <Link as={RouterLink} to="/join"><ExternalLinkIcon mr={2} />Join Game</Link>}
      {user && <Button onClick={handleLogout}><ArrowForwardIcon mr={2} />Logout</Button>}
      {!user && <Link as={RouterLink} to="/login"><UnlockIcon mr={2} />Login</Link>}
    </VStack>
  );
}
const SideBar = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <AuthenticatedLinks onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default SideBar;
