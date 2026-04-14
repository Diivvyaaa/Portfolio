import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBsdoN0nbN4HOphTHGg4yeXqUexyyxBuFk",
  authDomain: "my-portfolio-265ea.firebaseapp.com",
  projectId: "my-portfolio-265ea",
  storageBucket: "my-portfolio-265ea.firebasestorage.app",
  messagingSenderId: "78860462288",
  appId: "1:78860462288:web:c9aa8ac7a1cf1e462856d5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
