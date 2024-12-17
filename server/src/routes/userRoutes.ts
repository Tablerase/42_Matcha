import express, { Router } from "express";
import * as UserViews from "@views/userViews";
import { getUserBlockedUsers, blockUser, unblockUser } from "@views/blockedViews";

const router: Router = express.Router();

router.get("/", UserViews.getUsers);
router.get("/:id", UserViews.getUserById);
router.put("/:id", UserViews.updateUser);

router.get("/:id/blocked", getUserBlockedUsers);
router.post("/:id/blocked", blockUser);
router.delete("/:id/blocked", unblockUser);
router.get("/:id/tags", UserViews.getUserTags);
router.post("/:id/tags", UserViews.addUserTag);
router.delete("/:id/tags", UserViews.deleteUserTag);

export default router;
