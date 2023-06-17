import React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "./AuthProvider";
import {
  AddIcon,
  ExternalLinkIcon,
  ArrowForwardIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function AuthenticatedLinks({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    onClose();
  };

  if (user === null) {
    return (
      <VStack spacing="1rem" align="start">
        <Text p={"4"}>Please log in to access menu items.</Text>
      </VStack>
    );
  }

  const handleClick = (path) => {
    navigate(path);
    onClose(); // Close the sidebar immediately after clicking a button
  };

  return (
    <VStack spacing="1rem" align="start">
      {user && (
        <Button onClick={() => handleClick("/create")} leftIcon={<AddIcon />}>
          Create Game
        </Button>
      )}
      {user && (
        <Button
          onClick={() => handleClick("/join")}
          leftIcon={<ExternalLinkIcon />}
        >
          Join Game
        </Button>
      )}
      {user && (
        <Button onClick={handleLogout} leftIcon={<ArrowForwardIcon />}>
          Logout
        </Button>
      )}
      {!user && (
        <Button onClick={() => handleClick("/login")} leftIcon={<UnlockIcon />}>
          Login
        </Button>
      )}
    </VStack>
  );
}

export const SideBar = ({ isOpen, onClose }) => {
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
