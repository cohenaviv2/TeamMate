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

export interface IEvent {
  title: string;
  date: Date;
  sportType: SportType;
  imageUrl: string;
  location: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  participants: string[];
  creator: {
    id: string;
    fullName: string;
    imageUrl: string;
  };
  createdAt: Date;
  locationType?: "indoor" | "outdoor";
  participantsLimit?: number;
  description?: string;
  id?: string;
}