import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  PopoverBody,
  PopoverHeader,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  Button,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";

const HowToPlay = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button onClick={onOpen} leftIcon={<QuestionIcon />}>
          How to Play
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          bg="white"
          color="black"
          p={5}
          maxW="lg" // This is to prevent the popover from being too wide
          w="90%" // This is to make the popover responsive
          mx="auto" // This is to center the popover
        >
          <PopoverCloseButton />
          <PopoverHeader color="black">How to Play LCR Online</PopoverHeader>
          <PopoverBody>
            <Box>
              <Text mb={4}>
                First, click on "Create a Game" to become the game host. You
                will receive a unique lobby code, share this code with two of
                your friends. They should enter this code in the "Lobby Code"
                field and then join the game. Once all players have joined and
                hit ready up, you can start the game by clicking "Start Game".
              </Text>
              <hr />
              <Heading pt={4} size="sm" mb={2}>
                Rules
              </Heading>
              <List spacing={2}>
                <ListItem>
                  Players take turns rolling three dice by clicking the "Roll
                  Dice" button.
                </ListItem>
                <ListItem>
                  The faces of the dice have either Left, Right, Center, or a
                  dot.
                </ListItem>
                <ListItem>
                  If you roll a Left, Right, or Center, pass a chip in that
                  direction.
                </ListItem>
                <ListItem>
                  A Center roll means a chip goes to the center pot.
                </ListItem>
                <ListItem>
                  The game continues until one player has all the chips, who
                  then becomes the winner.
                </ListItem>
              </List>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default HowToPlay;
