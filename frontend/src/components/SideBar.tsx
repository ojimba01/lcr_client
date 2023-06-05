// SideBar.tsx
import React from 'react';
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, VStack } from '@chakra-ui/react';
import { useAuth } from './AuthProvider';
import { AddIcon, ExternalLinkIcon, ArrowForwardIcon, UnlockIcon, QuestionIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

function AuthenticatedLinks({ onClose }) {
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

  const handleClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <VStack spacing="1rem" align="start">
      {user && <Button onClick={() => handleClick("/how-to-play")} leftIcon={<QuestionIcon/>}>How To Play</Button>}
      {user && <Button onClick={() => handleClick("/create")} leftIcon={<AddIcon />}>Create Game</Button>}
      {user && <Button onClick={() => handleClick("/join")} leftIcon={<ExternalLinkIcon />}>Join Game</Button>}
      {user && <Button onClick={handleLogout} leftIcon={<ArrowForwardIcon />}>Logout</Button>}
      {!user && <Button onClick={() => handleClick("/login")} leftIcon={<UnlockIcon />}>Login</Button>}
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
