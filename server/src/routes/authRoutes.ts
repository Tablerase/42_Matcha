import express, { Router } from "express";
import {
  validateUserLogin,
  validateUserCreation,
} from "@middlewares/validateUser";
import { authenticateUser, logoutUser, checkUser } from "@views/authViews";
import { createUser } from "@views/userViews";
import { authenticateToken } from "@middlewares/auth";

const router: Router = express.Router();

router.post("/login", validateUserLogin, authenticateUser);
router.post("/signup", validateUserCreation, createUser);

// router.post("/logout", authenticateToken, logoutUser);
router.post("/logout", logoutUser);

router.get("/check", checkUser);

// router.post('/forgot-password', validateEmail, forgotPassword);
// router.post('/refresh-token', validateRefreshToken, refreshToken);

export default router;
