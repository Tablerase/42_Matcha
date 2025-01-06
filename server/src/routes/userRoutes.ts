import express, { Router } from "express";
import * as UserViews from "@views/userViews";
import * as TagViews from "@views/tagViews";
import * as LikeViews from "@views/likeViews";
import * as MatchViews from "@views/matchViews";
import * as ImageViews from "@views/imageViews";
import {
  getUserBlockedUsers,
  blockUser,
  unblockUser,
} from "@views/blockedViews";
import {
  validateUserUpdate,
  validateUserBlocked,
} from "../middleware/validateUser";

const router: Router = express.Router();

// TODO: add validators everywhere where needed
router.get("/", UserViews.getUsers);
router.get("/me", UserViews.getCurrentUser);
router.get("/:id", UserViews.getUserById);
router.put("/:id", validateUserUpdate, UserViews.updateUser);

router.get("/:id/blocked", validateUserBlocked, getUserBlockedUsers);
router.post("/:id/blocked", validateUserBlocked, blockUser);
router.delete("/:id/blocked", validateUserBlocked, unblockUser);

router.get("/:id/tags", TagViews.getUserTags);
router.post("/:id/tags", TagViews.addUserTag);
router.delete("/:id/tags", TagViews.deleteUserTag);

router.get("/:id/likes", LikeViews.getUserLikes);
router.post("/:id/likes", LikeViews.addUserLike);
router.delete("/:id/likes", LikeViews.deleteUserLike);

router.get("/:id/matches", MatchViews.getUserMatches);
router.delete("/:id/matches", MatchViews.deleteUserMatch);

router.get("/:id/images", ImageViews.getUserImages);
router.post("/:id/images", ImageViews.createUserImage);

export default router;
