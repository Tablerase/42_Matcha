import express, { Router } from "express";
import {
  validateUserLogin,
  validateUserCreation,
} from "@middlewares/validateUser";
import { authenticateUser, logoutUser, checkUser } from "@views/authViews";
import {
  createUser,
  verifyEmail,
} from "@views/userViews";

const router: Router = express.Router();

// Auth endpoints
router.post("/login", validateUserLogin, authenticateUser);
router.post("/signup", validateUserCreation, createUser);
router.post("/logout", logoutUser);
router.get("/check", checkUser);

// Email verification endpoints
router.get("/verify-email", verifyEmail);

export default router;
