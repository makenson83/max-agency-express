// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBVarvB2l1nKwtfTwS3nCbV3HIdC7",
  authDomain: "max-agency-express.firebaseapp.com",
  projectId: "max-agency-express",
  storageBucket: "max-agency-express.appspot.com",
  messagingSenderId: "4907592552",
  appId: "1:4907592552:web:5f563f7939b10860b0",
  measurementId: "G-PBX13GCT9"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
