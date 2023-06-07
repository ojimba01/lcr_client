// HowToPlay.tsx
import { Box, Heading, Text,List, ListItem, Flex } from '@chakra-ui/react';


const HowToPlay = () => {
    return (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        // height={['90%', '80%', '70%', '60%', '50%']}
        width={['90%', '80%', '70%', '60%', '50%']} // For responsive design
        mx="auto" // For centering horizontally
        my="auto" // For centering vertically
      >
        <Box width="100%">
          <Heading size= "xl" mb={4}>How to Play LCR Online</Heading>
          <Text mb={4}>
             First, click on "Create a Game" to become the game host. 
            You will receive a unique lobby code, share this code with two of your friends. 
            They should enter this code in the "Lobby Code" field and then join the game. 
            Once all players have joined and hit ready up, you can start the game by clicking "Start Game".
          </Text>
          <br />
          <hr />
          <br />
          <Heading size="md" mb={2}>Rules</Heading>
          <List>
            <ListItem>Players take turns rolling three dice by clicking the "Roll Dice" button.</ListItem>
            <ListItem>The faces of the dice have either Left, Right, Center, or a dot.</ListItem>
            <ListItem>If you roll a Left, Right, or Center, pass a chip in that direction.</ListItem>
            <ListItem>A Center roll means a chip goes to the center pot.</ListItem>
            <ListItem>The game continues until one player has all the chips, who then becomes the winner.</ListItem>
          </List>
        </Box>
      </Flex>
    );
  };
  
  export default HowToPlay;