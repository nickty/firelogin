// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmUEiNSaXr1KsOAJbxZVtFeOMPXBOSJFQ",
  authDomain: "rnfirelogin.firebaseapp.com",
  projectId: "rnfirelogin",
  storageBucket: "rnfirelogin.appspot.com",
  messagingSenderId: "304082825137",
  appId: "1:304082825137:web:29dbd5b7f7ee88db935790",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
