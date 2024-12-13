import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// TODO: Implement this protrction, isn't called anywhere
export const validateUserCreation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .trim(),
  body('password')
    .isLength({ min: 8 })
    .trim()
    .escape(),
  body('firstName')
    .isLength({ min: 2 })
    .trim()
    .escape(),
  body('lastName')
    .isLength({ min: 2 })
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];