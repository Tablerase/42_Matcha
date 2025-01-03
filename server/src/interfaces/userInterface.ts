// export interface Point {
//   x: number; // longitude
//   y: number; // latitude
// }

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  gender?: string;
  preferences?: string;
  dateOfBirth?: Date;
  bio?: string;
  location?: { x: number; y: number };
  location_postal?: string,
  fameRate?: number;
  lastSeen?: Date;
  created?: Date;
  updated?: Date;
}

export interface SortParams {
  age?: { min: number; max: number };
  location?: { x: number; y: number };
  fameRate?: number;
  tags?: string[];
}
