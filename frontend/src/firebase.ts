import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';

let firebaseConfig: any;
if (import.meta.env.VITE_FIREBASE_CREDENTIALS) {
  firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CREDENTIALS);
} else {
  throw new Error("VITE_FIREBASE_CREDENTIALS is not provided.");
}

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth();
export const signIn = signInWithEmailAndPassword;
export const createUser = createUserWithEmailAndPassword;
export const signInAnon = signInAnonymously;
