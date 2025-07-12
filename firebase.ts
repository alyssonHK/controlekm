import { initializeApp } from "firebase/app";
import { collection, getDocs, addDoc, deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';

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

export const fetchChecklistModel = async () => {
  const db = getFirestore();
  const querySnapshot = await getDocs(collection(db, 'checklistModel'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addChecklistModelItem = async (text: string) => {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, 'checklistModel'), { text });
  return { id: docRef.id, text };
};

export const removeChecklistModelItem = async (id: string) => {
  const db = getFirestore();
  await deleteDoc(doc(db, 'checklistModel', id));
};

export const updateChecklistModelItem = async (id: string, text: string) => {
  const db = getFirestore();
  const ref = doc(db, 'checklistModel', id);
  await updateDoc(ref, { text });
};
