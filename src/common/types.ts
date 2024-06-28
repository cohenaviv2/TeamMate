export interface IUser {
  fullName: string;
  email: string;
  password: string;
  imageUrl: string;
  age: number;
  city: string;
  favoriteSport: SportType;
  id: string;
}

export type SportType = "All" | "Basketball" | "Baseball" | "Tennis" | "Football" | "Soccer" | "Hockey" | "Volleyball" | "Golf" | "Cycling";

export const sportTypeList: SportType[] = ["All", "Basketball", "Baseball", "Tennis", "Football", "Soccer", "Hockey", "Volleyball", "Golf", "Cycling"];

export interface IEvent {
  sportType: SportType;
  title: string;
  dateTime: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  participants: {
    [participantId: string]: {
      user: IUserDetails;
    };
  };
  creator: IUserDetails;
  createdAt: string;
  imageUrl?: string;
  locationType?: "indoor" | "outdoor";
  participantsLimit?: number;
  description?: string;
  id: string;
}

export interface IUserDetails {
  id: string;
  fullName: string;
  imageUrl: string;
}

export type DateFilter = "Month" | "Week" | "Today";
export const dateFilters: DateFilter[] = ["Month", "Week", "Today"];
