import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXeDMCE1ZQCYrBcctS3T1gWO5TriJ9Zpo",
  authDomain: "jornada-vet.firebaseapp.com",
  projectId: "jornada-vet",
  storageBucket: "jornada-vet.firebasestorage.app",
  messagingSenderId: "574615831632",
  appId: "1:574615831632:web:08b084f2310b97f1cf3d55",
  measurementId: "G-61T07G38TX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs
};

// -----------------------------------------------------------
// 🔥 CORREÇÃO DEFINITIVA PARA O FIREFOX
// Detecta Firefox e usa sessionPersistence em vez de IndexedDB
// -----------------------------------------------------------
const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

setPersistence(auth, isFirefox ? browserSessionPersistence : browserLocalPersistence)
  .then(() => {
    console.log(
      "Persistência configurada para:",
      isFirefox ? "browserSessionPersistence (Firefox)" : "browserLocalPersistence"
    );
  })
  .catch((error) => {
    console.error("Erro ao definir persistência:", error);
  });
