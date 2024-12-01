// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Firebase configuration for the primary database
const firebaseConfig = {
  apiKey: "AIzaSyBJchGkHDbdPTdrH-nRE06JZG0b_Hf1Frk",
  authDomain: "connect21-d0acd.firebaseapp.com",
  databaseURL: "https://connect21-d0acd-default-rtdb.firebaseio.com",
  projectId: "connect21-d0acd",
  storageBucket: "connect21-d0acd.firebasestorage.app",
  messagingSenderId: "233350318265",
  appId: "1:233350318265:web:9a9d112b61a7163fa8b368",
  measurementId: "G-4WZN05J8LT",
};

// Firebase configuration for the secondary (user-specific) database
const firebaseUsers = {
  apiKey: "AIzaSyBJchGkHDbdPTdrH-nRE06JZG0b_Hf1Frk",
  authDomain: "connect21-d0acd.firebaseapp.com",
  databaseURL: "https://connect21-users.firebaseio.com/",
  projectId: "connect21-d0acd",
  storageBucket: "connect21-d0acd.firebasestorage.app",
  messagingSenderId: "233350318265",
  appId: "1:233350318265:web:9a9d112b61a7163fa8b368",
  measurementId: "G-4WZN05J8LT",
};

// Initialize Firebase apps
const app = initializeApp(firebaseConfig); // Default app
const userApp = initializeApp(firebaseUsers, "userApp"); // Secondary app with unique name

// Get references to the databases and auth
const database = getDatabase(app); // Primary database
const auth = getAuth(app); // Auth for the primary app
const users = getDatabase(userApp); // Secondary database

setPersistence(auth, browserLocalPersistence)
  .catch((error) => console.error("Error setting persistence:", error));

export { database, auth, users };
