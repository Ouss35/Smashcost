import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDtRSzZaV70SKfjngnD4aXsUp2jHX0MNzs",
  authDomain: "smash-cost.firebaseapp.com",
  projectId: "smash-cost",
  storageBucket: "smash-cost.firebasestorage.app",
  messagingSenderId: "887766511922",
  appId: "1:887766511922:web:0660d8665206d83427672b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
