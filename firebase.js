import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7Nz8N1XmVStcfWf3SwCnbv3HdCjv4Sc4",
  authDomain: "max-agency-express.firebaseapp.com",
  projectId: "max-agency-express",
  storageBucket: "max-agency-express.appspot.com",
  messagingSenderId: "109579502552",
  appId: "1:109579502552:web:5f56397f930b86c08090ad",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };