import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAwHfkR9VwhxJWKR-ea5VgW11CAUwBnuXk",
  authDomain: "quanly-9beb1.firebaseapp.com",
  projectId: "quanly-9beb1",
  storageBucket: "quanly-9beb1.firebasestorage.app",
  messagingSenderId: "1014914236793",
  appId: "1:1014914236793:web:f8b8c63dced7fc789a2fa8",
  measurementId: "G-737RKT33XD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics }; 