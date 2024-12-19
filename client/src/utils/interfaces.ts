import { ReactNode } from "react";

export interface UserLogin {
  username: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
}

export interface Props {
  children: ReactNode;
}
