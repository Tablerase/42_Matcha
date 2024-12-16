import { Request, Response, NextFunction } from "express";
import {
  userCreationSchema,
  userLoginSchema,
} from "@interfaces/userValidationSchema";
import { z } from "zod";
export const validateUserCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    userCreationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

export const validateUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    userLoginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

//validation userupdate

//validation user params for advanced search
