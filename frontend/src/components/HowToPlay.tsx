// HowToPlay.tsx
import { Box, Heading, Text, OrderedList, ListItem } from '@chakra-ui/react';

const HowToPlay = () => {
    return (
      <Box 
        // direction="column"
        alignItems="center"
        justifyContent="center"
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        width={['90%', '80%', '70%', '60%', '50%']} // For responsive design
        // height={['40%']}
        mx="auto" // For centering horizontally
        my="auto" // For centering vertically
      >
        <Heading mb={4}>How to Play LCR Online</Heading>
        <Text mb={2}>
          LCR, short for "Left, Center, Right", is a simple, fun, and fast-paced dice game. 
          Here's how you can play it online: First, click on "Create a Game" to become the game host. 
          You will receive a unique lobby code, share this code with two of your friends. 
          They should enter this code in the "Join Game" field and then join the game. 
          Once all players have joined, you can start the game by clicking "Start Game".
        </Text>
        <br />
        <hr />
        <br />
        <Heading size="md" mb={2}>Rules</Heading>
        <OrderedList>
          <ListItem>Players take turns rolling three dice by clicking the "Roll Dice" button.</ListItem>
          <ListItem>The faces of the dice have either Left, Right, Center, or a dot.</ListItem>
          <ListItem>If you roll a Left, Right, or Center, pass a chip in that direction.</ListItem>
          <ListItem>A Center roll means a chip goes to the center pot.</ListItem>
          <ListItem>The game continues until one player has all the chips, who then becomes the winner.</ListItem>
        </OrderedList>
      </Box>
    );
  };
  
  export default HowToPlay;
