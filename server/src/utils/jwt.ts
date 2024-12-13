import jwt from 'jsonwebtoken';
import { User } from '@interfaces/userInterface';
import {
  ACCESSTOKEN_EXPIRES_IN,
  REFRESHTOKEN_EXPIRES_IN,
  JWT_SECRET_KEY,
} from "../settings";


export const createAccessToken = (user: Partial<User>): string => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email 
    },
    JWT_SECRET_KEY,
    { expiresIn: ACCESSTOKEN_EXPIRES_IN }
  );
};

export const createRefreshToken = (data: any): string => {
  return jwt.sign(data, JWT_SECRET_KEY, { expiresIn: REFRESHTOKEN_EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

// export const decodeAuthToken = (token: string): any => {
//   return jwt_decode(token);
// };
