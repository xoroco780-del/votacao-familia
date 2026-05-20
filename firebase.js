import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAI8BTakoyaPIyEU0dPDkXgNKUU92BNbh0",
  authDomain: "votacao-familia.firebaseapp.com",
  projectId: "votacao-familia",
  storageBucket: "votacao-familia.firebasestorage.app",
  messagingSenderId: "624703924970",
  appId: "1:624703924970:web:056e0e2b489b0245604593",
  measurementId: "G-N1RSTZBLTG"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);