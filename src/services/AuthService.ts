import { Firebase } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { set, ref, get, child, DataSnapshot } from "firebase/database";
import { IUser } from "../common/types";

export const AuthService = {
  async register(user: IUser): Promise<IUser> {
    try {
      const credentials = await createUserWithEmailAndPassword(Firebase.auth, user.email, user.password);
      const uid = credentials.user.uid;
      if (!uid) throw new Error("User not authenticated");
      // create new user in db
      user.id = uid;
      user.password = "";
      await set(ref(Firebase.db, `users/${user.id}`), user);
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<IUser> {
    try {
      const credentials = await signInWithEmailAndPassword(Firebase.auth, email, password);
      const userRef = ref(Firebase.db, `users/${credentials.user.uid}`);
      const snapshot: DataSnapshot = await get(child(userRef, "/"));
      if (!snapshot.exists()) throw new Error("User do not exist");
      const userData: IUser = snapshot.val();
      return userData;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await Firebase.auth.signOut();
    } catch (error) {
      throw error;
    }
  },
};
