import React, { useState } from 'react';
import { auth, signIn, createUser } from '../firebase';

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
    <div className='login'>
      <h1>Login</h1>
      <form>
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email'/>
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
        <button type='submit' onClick={loginUser}>Sign In</button>
        <button onClick={register}>Register</button>
      </form>
    </div>
  );
}

export default Login;
