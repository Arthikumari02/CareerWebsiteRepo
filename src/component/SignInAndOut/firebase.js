import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgcsdLsR_7dregPvmsed3ZYRUr7kze314",
  authDomain: "lifecraft-8426d.firebaseapp.com",
  projectId: "lifecraft-8426d",
  storageBucket: "lifecraft-8426d.firebasestorage.app",
  messagingSenderId: "781428355315",
  appId: "1:781428355315:web:6e0d6d6033ae80c0a7c786",
  measurementId: "G-TEQB1X5970"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;