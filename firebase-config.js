// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBQRuap9Dwzx5fF_eABy98IZNq6HNzF4s",
  authDomain: "adm23-217f5.firebaseapp.com",
  projectId: "adm23-217f5",
  storageBucket: "adm23-217f5.firebasestorage.app",
  messagingSenderId: "649893263437",
  appId: "1:649893263437:web:272edcbdd03f5f64478404",
  measurementId: "G-7LR7QDKJVH",
  databaseURL: "https://adm23-217f5-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);

export default app;
