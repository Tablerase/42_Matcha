// export interface Point {
//   x: number; // longitude
//   y: number; // latitude
// }

import { Tag } from "./tagInterface";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  gender?: Gender;
  preferences?: Gender[];
  dateOfBirth?: Date;
  bio?: string;
  location?: { x: number; y: number };
  city?: string;
  fameRate?: number;
  lastSeen?: Date;
  created?: Date;
  updated?: Date;
}

export interface PublicUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  gender?: Gender;
  preferences?: Gender[];
  dateOfBirth?: Date;
  bio?: string;
  city?: string;
  fameRate: number;
  lastSeen?: Date;
  // Details
  tags?: Tag[];
  age?: number;
  distance?: number;
}

export interface SortParams {
  age?: { min: number; max: number };
  location?: { x: number; y: number };
  fameRate?: number;
  tags?: string[];
}
