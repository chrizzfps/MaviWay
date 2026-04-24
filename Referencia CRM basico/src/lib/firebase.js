import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCd-pzcTDACTqx5xizu52bytP8tZtbSaAQ",
  authDomain: "maviwaydev.firebaseapp.com",
  projectId: "maviwaydev",
  storageBucket: "maviwaydev.firebasestorage.app",
  messagingSenderId: "212287820834",
  appId: "1:212287820834:web:ce9f033f924cae762ca67b",
  measurementId: "G-TX7JENV0XJ"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
