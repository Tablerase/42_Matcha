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

function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user = jwt.verify(token, JWT_SECRET_KEY as string) as JWTPayload;

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(403);
  }
}

export { authenticateToken };
