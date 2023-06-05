import React, { useState } from 'react';
import { auth, signIn, createUser } from '../firebase';
import { Box, Heading, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (event) => {
    event.preventDefault();
    try {
      await signIn(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (event) => {
    event.preventDefault();
    try {
      await createUser(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box maxW={["sm", "md", "lg", "2xl"]} margin="0 auto" mt={20} p={6} borderWidth={1} borderRadius="md" boxShadow="md">
      <Heading mb={6} textAlign="center">Login</Heading>
      <form>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
        </FormControl>
        <Button colorScheme="blue" onClick={loginUser} mr={2} mb={4} width="100%">
          Sign In
        </Button>
        <Button onClick={register} variant="outline" width="100%">
          Register
        </Button>
      </form>
    </Box>
  );
}

export default Login;
