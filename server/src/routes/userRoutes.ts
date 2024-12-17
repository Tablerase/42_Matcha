import express, { Router } from "express";
import { getUsers, getUserById, updateUser } from "@views/userViews";
import { getUserBlockedUsers, blockUser, unblockUser } from "@views/blockedViews";

const router: Router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);

router.get("/:id/blocked", getUserBlockedUsers);
router.post("/:id/blocked", blockUser);
router.delete("/:id/blocked", unblockUser);

export default router;
