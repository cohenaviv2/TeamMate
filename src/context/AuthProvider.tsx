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
  error: any | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = Firebase.auth.onAuthStateChanged(async (authUser) => {
      setLoading(true);
      if (authUser && !currentUser) {
        setTimeout(() => {
          UserModel.getUserById(authUser.uid)
            .then((dbUser) => setCurrentUser({ authUser, dbUser }))
            .catch((error) => {
              console.log(error);
              setError(error);
            })
            .finally(() => setLoading(false));
        }, 2000);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ currentUser, setCurrentUser, loading, error }}>{children}</AuthContext.Provider>;
};
