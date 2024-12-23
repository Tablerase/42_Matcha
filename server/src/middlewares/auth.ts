import { Request, Response, NextFunction } from "express";
import { JWT_SECRET_KEY } from "../settings";
import jwt from "jsonwebtoken";

// Interface for JWT payload
interface JWTPayload {
  id: number;
  // Add other payload fields you need
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authToken = req.cookies?.authToken;

  if (!authToken) {
    res.status(401).json({ message: "No auth token found" });
    return;
  }

  try {
    const decoded = jwt.verify(
      authToken,
      JWT_SECRET_KEY as string
    ) as unknown as JWTPayload;

    if (!decoded.id) {
      res.status(403).json({ message: "Invalid token payload" });
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid token" });
    return;
  }
};
