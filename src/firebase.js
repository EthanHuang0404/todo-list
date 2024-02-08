// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6YZeQysYLKDyJCCcytJzcg17nUVKbveo",
  authDomain: "todo-list-778b0.firebaseapp.com",
  projectId: "todo-list-778b0",
  storageBucket: "todo-list-778b0.appspot.com",
  messagingSenderId: "94984355045",
  appId: "1:94984355045:web:f8147ad07764b3c2e5280c",
  measurementId: "G-BKR1YVN4XX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);