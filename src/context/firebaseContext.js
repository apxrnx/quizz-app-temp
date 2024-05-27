// firebaseContext.js
"use client";
import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { app } from "../../firebase";
import { getAuth } from "firebase/auth";

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  // Check if Firebase app is already initialized
  const auth = getAuth(app);

  return (
    <FirebaseContext.Provider value={app}>{children}</FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
