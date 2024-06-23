import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Firebase } from "../services/firebaseConfig";
import { User } from "firebase/auth";
import { IUser } from "../common/types";
import UserModel from "../models/UserModel";

export interface AuthUser {
  authUser: User;
  dbUser: IUser;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
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
      if (authUser && !currentUser) {
        try {
          const dbUser = await UserModel.getUserById(authUser.uid);
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

  return <AuthContext.Provider value={{ currentUser, setCurrentUser, loading, error }}>{children}</AuthContext.Provider>;
};
