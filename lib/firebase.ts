import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUoJzErKsftcfHl4EJOwjHtyTt7nzgnDU",
  authDomain: "rwesh-98a7b.firebaseapp.com",
  projectId: "rwesh-98a7b",
  storageBucket: "rwesh-98a7b.firebasestorage.app",
  messagingSenderId: "598454381855",
  appId: "1:598454381855:web:1880dc56eff39e0a8e542a",
  measurementId: "G-ES4RHGLQ7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;