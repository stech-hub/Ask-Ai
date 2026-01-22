// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyAIL9Ki7OVqgq23LgAQhmFQzN8ZAMtGM",
  authDomain: "bionurse-pro.firebaseapp.com",
  projectId: "bionurse-pro",
  storageBucket: "bionurse-pro.appspot.com",
  messagingSenderId: "262309708872",
  appId: "1:262309708872:web:b26529e0283a17aafc447d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// Logout
export const logout = async () => await signOut(auth);

// Save messages per user
export const saveMessages = async (uid, messages) => {
  const docRef = doc(db, "chats", uid);
  await setDoc(docRef, { messages }, { merge: true });
};

// Load messages per user
export const loadMessages = async (uid) => {
  const docRef = doc(db, "chats", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data().messages || [];
  return [];
};
