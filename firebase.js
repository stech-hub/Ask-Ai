import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyAIL9Ki7OVqgq23LgAQhmFQzN8ZAMtGM",
  authDomain: "bionurse-pro.firebaseapp.com",
  projectId: "bionurse-pro",
  storageBucket: "bionurse-pro.firebasestorage.app",
  messagingSenderId: "262309708872",
  appId: "1:262309708872:web:b26529e0283a17aafc447d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// Sign Out
export const logout = async () => await signOut(auth);

// Firestore chat storage
export const saveMessages = async (userId, newMessages) => {
  const userDoc = doc(db, "chats", userId);
  const docSnap = await getDoc(userDoc);

  if (!docSnap.exists()) {
    await setDoc(userDoc, { messages: newMessages });
  } else {
    await updateDoc(userDoc, {
      messages: arrayUnion(...newMessages.slice(docSnap.data().messages.length))
    });
  }
};

export const loadMessages = async (userId) => {
  const userDoc = doc(db, "chats", userId);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) return docSnap.data().messages || [];
  return [];
};

export { db, auth };
