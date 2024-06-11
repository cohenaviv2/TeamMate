export interface IUser {
  fullName: string;
  email: string;
  password: string;
  imageUrl: string;
  favoriteSport: SportType;
  id?: string;
}

export type SportType =
  | "Basketball"
  | "Baseball"
  | "Tennis"
  | "Football"
  | "Soccer"
  | "Hockey"
  | "Volleyball"
  | "Golf"
  | "Cycling";

export const sportTypeList: SportType[] = [
  "Basketball",
  "Baseball",
  "Tennis",
  "Football",
  "Soccer",
  "Hockey",
  "Volleyball",
  "Golf",
  "Cycling",
];
