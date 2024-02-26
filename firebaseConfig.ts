// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-BPQ4LHBl0yGhCnG6hXKzHzoCk-aOras",
  authDomain: "scaleup-46d40.firebaseapp.com",
  projectId: "scaleup-46d40",
  storageBucket: "scaleup-46d40.appspot.com",
  messagingSenderId: "945955034276",
  appId: "1:945955034276:web:f18217b158aff495434231",
  measurementId: "G-QH7WEGGKXR"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
// const analytics = getAnalytics(FIREBASE_APP);