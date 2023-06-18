import {
  Box,
  Heading,
  Text,
  UnorderedList,
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
          maxW="md" // This is to prevent the popover from being too wide
          w="80%" // This is to make the popover responsive
          mx="auto" // This is to center the popover
        >
          <PopoverCloseButton />
          <PopoverHeader color="black">
            {" "}
            <b>How to Play LCR Online</b>
          </PopoverHeader>
          <PopoverBody>
            <Box>
              <UnorderedList spacing={2}>
                <ListItem>
                  Click on "Create a Game" to become the game host.
                </ListItem>
                <ListItem>
                  Send the lobby code to your friends so they can join your
                  game.
                </ListItem>
                <ListItem>
                  Once everyone has joined wait for everyone to click on the
                  "Ready Up" button.
                </ListItem>
                <ListItem>
                  If everyone is ready in the lobby anyone can start the game by
                  clicking "Start Game".
                </ListItem>
              </UnorderedList>

              <hr />
              <Heading pt={4} size="sm" mb={2}>
                Rules
              </Heading>
              <UnorderedList spacing={2}>
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
                  The game continues until everyone but one player has no chips.
                  The last player with chips wins the game.
                </ListItem>
              </UnorderedList>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default HowToPlay;
