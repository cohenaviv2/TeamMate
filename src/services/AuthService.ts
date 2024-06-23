import { Firebase } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { set, ref, get, child, DataSnapshot } from "firebase/database";
import { IUser } from "../common/types";
import { AuthUser } from "../context/AuthProvider";

class AuthService  {
  static async register(user: IUser): Promise<AuthUser> {
    try {
      const credentials = await createUserWithEmailAndPassword(Firebase.auth, user.email, user.password);
      const uid = credentials.user.uid;
      if (!uid) throw new Error("User not authenticated");
      // create new user in db
      user.id = uid;
      user.password = "";
      await set(ref(Firebase.db, `users/${user.id}`), user);
      const authUser:AuthUser = {authUser:credentials.user,dbUser:user}
      return authUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<IUser> {
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
  }

  static async logout() {
    try {
      await signOut(Firebase.auth);
      await Firebase.auth.signOut();
    } catch (error) {
      throw error;
    }
  }
};

export default AuthService;
