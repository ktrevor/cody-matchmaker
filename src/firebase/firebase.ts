import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxgXYG_1TIEV9CieBtZcwpKFJpR5hcoO4",
  authDomain: "cody-matchmaker.firebaseapp.com",
  projectId: "cody-matchmaker",
  storageBucket: "cody-matchmaker.firebasestorage.app",
  messagingSenderId: "983435578576",
  appId: "1:983435578576:web:ce56172b4153be679c62d5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db: Firestore = getFirestore(app);
