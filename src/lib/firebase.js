import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBSBQXRZAPqFBk6EtNxC3r8-YvHtyf52gQ",
  authDomain: "sinergiacdb.firebaseapp.com",
  projectId: "sinergiacdb",
  storageBucket: "sinergiacdb.firebasestorage.app",
  messagingSenderId: "191479637343",
  appId: "1:191479637343:web:2fdc1000f209f73df402ea",
  measurementId: "G-G7K5GHQHNC"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
