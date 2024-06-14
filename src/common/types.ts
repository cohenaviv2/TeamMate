export interface IUser {
  fullName: string;
  email: string;
  password: string;
  imageUrl: string;
  favoriteSport: SportType;
  id?: string;
}

export type SportType = "All" | "Basketball" | "Baseball" | "Tennis" | "Football" | "Soccer" | "Hockey" | "Volleyball" | "Golf" | "Cycling";

export const sportTypeList: SportType[] = ["All", "Basketball", "Baseball", "Tennis", "Football", "Soccer", "Hockey", "Volleyball", "Golf", "Cycling"];
