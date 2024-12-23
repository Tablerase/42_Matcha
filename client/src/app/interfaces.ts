import { ReactNode } from "react";

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