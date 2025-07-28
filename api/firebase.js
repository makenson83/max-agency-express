// api/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBtY8NZlN3KtcfW3vSsnCbvb3HdCvl_s4k",
  authDomain: "max-agency-express.firebaseapp.com",
  projectId: "max-agency-express",
  storageBucket: "max-agency-express.appspot.com",
  messagingSenderId: "538764334583",
  appId: "1:405975052552:web:5f563f97930b86c08090ad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
