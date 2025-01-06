import express, { Router } from "express";
import {
  validateUserLogin,
  validateUserCreation,
} from "@middlewares/validateUser";
import { authenticateUser, logoutUser } from "@views/authViews";
import { createUser } from "@views/userViews";
import { authenticateToken } from "@middlewares/auth";

const router: Router = express.Router();

router.post("/login", validateUserLogin, authenticateUser);
router.post("/signup", validateUserCreation, createUser);

router.post("/logout", authenticateToken, logoutUser);

router.get("/check", authenticateToken, (req, res) => {
  res.status(200).json({ status: 200, message: "Authenticated" });
});

// TODO: Implement these routes
// router.post('/forgot-password', validateEmail, forgotPassword);
// router.post('/refresh-token', validateRefreshToken, refreshToken);

export default router;
