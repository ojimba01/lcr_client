import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CREDENTIALS);

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth();
export const signIn = signInWithEmailAndPassword;
export const createUser = createUserWithEmailAndPassword;

