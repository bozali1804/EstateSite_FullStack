import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfO16Su1TIwkBA7gJyRz-pASpRCIukvU0",
  authDomain: "karaca-emlak.firebaseapp.com",
  projectId: "karaca-emlak",
  storageBucket: "karaca-emlak.firebasestorage.app",
  messagingSenderId: "383139644058",
  appId: "1:383139644058:web:0fdaaf9b90da29eb8b1523"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
