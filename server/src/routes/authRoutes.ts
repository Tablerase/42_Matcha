import express, { Router } from "express";
import {
  validateUserLogin,
  validateUserCreation,
} from "@middlewares/validateUser";
import { authenticateUser, logoutUser, checkUser } from "@views/authViews";
import {
  createUser,
  verifyEmail,
  resetPassword,
  setResetToken,
} from "@views/userViews";

const router: Router = express.Router();

// Auth endpoints
router.post("/login", validateUserLogin, authenticateUser);
router.post("/signup", validateUserCreation, createUser);
router.post("/logout", logoutUser);
router.get("/check", checkUser);

// Email verification and passport reset endpoints
router.get("/verify-email", verifyEmail);
router.post("/reset-password", setResetToken);
router.put("/reset-password", resetPassword);

export default router;
