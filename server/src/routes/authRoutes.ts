import express, { Router } from "express";
import { authenticateUser } from "@views/authViews";
import { createUser } from "@views/userViews";
import { validateUserLogin, validateUserCreation } from "../middleware/validateUser";

const router: Router = express.Router();

router.post("/login", validateUserLogin, authenticateUser);
router.post("/signup", validateUserCreation, createUser);

// TODO: Implement these routes
// router.post('/logout', authenticateToken, logoutUser);
// router.post('/forgot-password', validateEmail, forgotPassword);
// router.post('/refresh-token', validateRefreshToken, refreshToken);

export default router;
