import { Firebase } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { set, ref, get, child, DataSnapshot } from "firebase/database";
import { IUser } from "../common/types";
import { FirebaseError } from "firebase/app";

export const UserService = {
  register: async (user: IUser): Promise<IUser | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        Firebase.auth,
        user.email,
        user.password
      );
      const uid = userCredential.user.uid;
      user.id = uid;
      // create new user in db
      await set(ref(Firebase.db, `users/${user.id}`), user);
      return user;
    } catch (error) {
      throw error;
    }
  },

  loginWithEmail: async (
    email: string,
    password: string
  ): Promise<IUser | null> => {
    try {
      const credentials = await signInWithEmailAndPassword(
        Firebase.auth,
        email,
        password
      );
      const userRef = ref(Firebase.db, `users/${credentials.user.uid}`);
      const snapshot: DataSnapshot = await get(child(userRef, "/"));

      if (snapshot.exists()) {
        const userData: IUser = snapshot.val();
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  uploadImage: async (uri: string) => {},
  //   // Login with Google
  //   loginWithGoogle: async () => {
  //     try {
  //       // Implement Google sign-in logic using Firebase Authentication
  //     } catch (error) {
  //       return { success: false, error: error.message };
  //     }
  //   },

  //   // Login with Facebook
  //   loginWithFacebook: async () => {
  //     try {
  //       // Implement Facebook sign-in logic using Firebase Authentication
  //     } catch (error) {
  //       return { success: false, error: error.message };
  //     }
  //   },

  //   // Logout
  //   logout: async () => {
  //     try {
  //       await firebase.auth().signOut();
  //       return { success: true };
  //     } catch (error) {
  //       return { success: false, error: error.message };
  //     }
  //   },

  //   // Get the current user
  //   getCurrentUser: () => {
  //     return firebase.auth().currentUser;
  //   },
};
