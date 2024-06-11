import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Firebase } from "../utils/firebaseConfig";
import { User } from "firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}


export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = Firebase.auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ currentUser, loading }}>{children}</AuthContext.Provider>;
};
