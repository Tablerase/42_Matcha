import express, { Router } from "express";
import { authenticateUser } from "@views/authViews";
import { createUser } from "@views/userViews";

const router: Router = express.Router();

router.post("/login", authenticateUser);
router.post("/signup", createUser);

// TODO: Implement these routes
// router.post('/logout', authenticateToken, logoutUser);
// router.post('/forgot-password', validateEmail, forgotPassword);
// router.post('/refresh-token', validateRefreshToken, refreshToken);

export default router;
