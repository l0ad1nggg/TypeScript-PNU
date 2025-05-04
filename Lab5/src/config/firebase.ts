// config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_Sa_GfzC9hlxAHHh_VkNSMaUvLEx79Mk",
  authDomain: "todoapp-pnu.firebaseapp.com",
  projectId: "todoapp-pnu",
  storageBucket: "todoapp-pnu.appspot.com",
  messagingSenderId: "412957758862",
  appId: "1:412957758862:web:b2b41527b0fa7cf9e500df",
  measurementId: "G-146PEPYYTK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();