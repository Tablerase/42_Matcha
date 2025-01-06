import { ReactNode } from "react";
import { Dayjs } from "dayjs";

export interface UserLogin {
  username: string;
  password: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  gender: string;
  preferences: string;
  dateOfBirth: Date;
  bio: string;
  location?: { x: number; y: number };
  location_postal: string;
  fameRate: number;
  lastSeen: Date;
}

export interface UserResponse {
  data: User;
  status: number;
}

export interface Props {
  children: ReactNode;
}

export interface Tag {
    id: number,
    tag: string
}

export interface ViewProfileProps {
  user: Partial<User>;
  tags: Tag[] | undefined;
  images: Image[] | undefined;
}

export interface FormData extends Omit<User, "dateOfBirth"> {
  dateOfBirth: Dayjs | null;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  gender: string;
  preferences: string;
  bio: string;
  location?: { x: number; y: number };
  location_postal: string,
  fameRate: number;
  lastSeen: Date;
  interests: Tag[];
}

export interface EditProfileProps {
  user: Partial<User>;
  userTags?: Tag[];
  setEditMode: () => void;
}

export interface Image {
  userId: number;
  url: string;
  isProfilePic?: boolean;
}