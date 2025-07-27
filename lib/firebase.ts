import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAUoJzErKsftcfHl4EJOwjHtyTt7nzgnDU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rwesh-98a7b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rwesh-98a7b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rwesh-98a7b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "598454381855",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:598454381855:web:1880dc56eff39e0a8e542a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ES4RHGLQ7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;