import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDxG9v0qPU5j9pUp3bdTkp8zzjQAnJMhGA",
    authDomain: "lcr-webapp.firebaseapp.com",
    databaseURL: "https://lcr-webapp-default-rtdb.firebaseio.com",
    projectId: "lcr-webapp",
    storageBucket: "lcr-webapp.appspot.com",
    messagingSenderId: "308796214321",
    appId: "1:308796214321:web:1909113806d4073c0b5910",
    measurementId: "G-6TJC0YK0TE"
  };

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth();
export const signIn = signInWithEmailAndPassword;
export const createUser = createUserWithEmailAndPassword;

