import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_XuFAVxqjFeN6tRzrPAxCDN8BaTmH7kw",
  authDomain: "kmrodado-1b15e.firebaseapp.com",
  projectId: "kmrodado-1b15e",
  storageBucket: "kmrodado-1b15e.firebasestorage.app",
  messagingSenderId: "846616835715",
  appId: "1:846616835715:web:1e379d474619f956c30db6",
  measurementId: "G-H2X1M0E2LL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
