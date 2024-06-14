import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Firebase } from "../services/firebaseConfig";
import { User } from "firebase/auth";
import { IUser } from "../common/types";
import { DataSnapshot, child, get, ref } from "firebase/database";

export interface AuthUser {
  authUser: User;
  dbUser: IUser;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  error: unknown;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const unsubscribe = Firebase.auth.onAuthStateChanged(async (authUser) => {
      setLoading(true);
      if (authUser) {
        try {
          const userRef = ref(Firebase.db, `users/${authUser.uid}`);
          const snapshot: DataSnapshot = await get(child(userRef, "/"));
          if (!snapshot.exists()) {
            throw new Error("User does not exist");
          }
          const dbUser: IUser = snapshot.val();
          console.log("Db user ok");
          setCurrentUser({ authUser, dbUser });
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ currentUser, loading, error }}>{children}</AuthContext.Provider>;
};
