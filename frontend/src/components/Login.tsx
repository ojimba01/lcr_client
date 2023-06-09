import React, { useState } from 'react';
import { auth, signIn, createUser } from '../firebase';
import { Box, Heading, FormControl, FormLabel, Input, Button, Text } from '@chakra-ui/react';
import { set } from 'firebase/database';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signIn(auth, email, password);
    } catch (error) {
      const errorCode = error.code;
      console.log(errorCode);
      let errorMessage = '';

      // Mapping Firebase error codes to custom error messages
      switch (errorCode) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Your account has been disabled.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Email address already in use.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
          break;
      }

      setError(errorMessage);
    }
  };

  const register = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createUser(auth, email, password);
    } catch (error) {
      const errorCode = error.code;
      let errorMessage = '';
      console.log(errorCode);
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email address already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
          break;
    }

    setError(errorMessage);
    }
  };

  return (
    <Box maxW={['sm', 'md', 'lg', '2xl']} margin="0 auto" mt={20} p={6} borderWidth={1} borderRadius="md" boxShadow="md">
      <Heading mb={6} textAlign="center">
        Login
      </Heading>
      <form>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </FormControl>
        {error && <Text color="red.500" mb={4}>{error}</Text>}
        <Button colorScheme="blue" onClick={loginUser} mr={2} mb={4} width="100%">
          Sign In
        </Button>
        <Button onClick={register} variant="outline" width="100%">
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Login;
