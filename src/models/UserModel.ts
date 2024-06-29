import { Firebase } from "../services/firebaseConfig";
import { ref, get, child, set, update, remove, DataSnapshot } from "firebase/database";
import { IUser, IUserDetails } from "../common/types";

class UserModel {
  static async getUserById(userId: string): Promise<IUser> {
    try {
      const userRef = ref(Firebase.db, `users/${userId}`);
      const snapshot: DataSnapshot = await get(child(userRef, "/"));
      if (!snapshot.exists()) throw new Error("User does not exist");
      const userData: IUser = snapshot.val();
      return userData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateUser(userId: string, userData: Partial<IUser>): Promise<void> {
    try {
      const userRef = ref(Firebase.db, `users/${userId}`);
      await update(userRef, userData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = ref(Firebase.db, `users/${userId}`);
      await remove(userRef);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getUsersByIds(userIds: string[]): Promise<IUserDetails[]> {
    try {
      const userDetailsPromises = userIds.map(async (userId) => {
        const userRef = ref(Firebase.db, `users/${userId}`);
        const snapshot: DataSnapshot = await get(child(userRef, "/"));
        if (snapshot.exists()) {
          const userData: IUser = snapshot.val();
          return {
            id: userData.id,
            fullName: userData.fullName,
            imageUrl: userData.imageUrl,
          } as IUserDetails;
        } else {
          throw new Error(`User with ID ${userId} does not exist`);
        }
      });

      const userDetails = await Promise.all(userDetailsPromises);
      return userDetails;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default UserModel;
