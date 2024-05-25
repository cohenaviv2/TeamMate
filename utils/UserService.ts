import { Firebase } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { set, ref } from "firebase/database";

export const UserService = {
  // Register a new user with email and password
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
      console.log(error);
      return null;
    }
  },

  uploadImage: async (uri:string)  => {

  }

  //   // Login with email and password
  //   loginWithEmail: async (email: string, password: string) => {
  //     try {
  //       await firebase.auth().signInWithEmailAndPassword(email, password);
  //       return { success: true };
  //     } catch (error) {
  //       return { success: false, error: error.message };
  //     }
  //   },

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
