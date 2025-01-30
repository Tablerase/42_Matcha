import jwt from "jsonwebtoken";
import { User } from "@interfaces/userInterface";
import {
  ACCESSTOKEN_EXPIRES_IN,
  REFRESHTOKEN_EXPIRES_IN,
  JWT_SECRET_KEY,
} from "../settings";

export const createAccessToken = (user: Partial<User>): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET_KEY,
    { expiresIn: ACCESSTOKEN_EXPIRES_IN * 60 }
  );
};

export const createRefreshToken = (user: Partial<User>): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET_KEY,
    { expiresIn: REFRESHTOKEN_EXPIRES_IN * 24 * 60 * 60 }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

// export const decodeAuthToken = (token: string): any => {
//   return jwt_decode(token);
// };
