import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logout = async () => await signOut(auth);

export const saveMessages = async (uid, messages) => {
  const docRef = doc(db, "chats", uid);
  await setDoc(docRef, { messages }, { merge: true });
};

export const loadMessages = async (uid) => {
  const docRef = doc(db, "chats", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().messages || [] : [];
};
