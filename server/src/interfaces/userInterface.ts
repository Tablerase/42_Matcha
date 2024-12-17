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
  location?: Point;
  fameRate?: number;
  lastSeen?: Date;
  created?: Date;
  updated?: Date;
}

export interface Point {
  x: number; // longitude
  y: number; // latitude
}
