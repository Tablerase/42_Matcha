import express, { Router } from "express";
import * as UserSearchView from "@views/userSearchViews";
import * as UserViews from "@views/userViews";
import * as TagViews from "@views/tagViews";
import * as LikeViews from "@views/likeViews";
import * as MatchViews from "@views/matchViews";
import * as ImageViews from "@views/imageViews";
import * as ViewsViews from "@views/viewViews";
import {
  getUserBlockedUsers,
  blockUser,
  unblockUser,
} from "@views/blockedViews";
import {
  validateUserUpdate,
  validateUserBlocked,
} from "../middlewares/validateUser";
import { validateUserSearchQuery } from "@middlewares/validateSearchQuery";
import { getUserReport, reportUser } from "@src/views/reportsView";

const router: Router = express.Router();

// Search routes
router.get("/search", validateUserSearchQuery, UserSearchView.searchUsers);

router.get("/", UserViews.getUsers);
router.get("/me", UserViews.getCurrentUser);
router.get("/:id", UserViews.getUserById);
router.put("/:id", validateUserUpdate, UserViews.updateUser);

router.get("/:id/online", UserViews.getUserOnlineStatus);

router.get("/:id/reports", getUserReport);
router.post("/:id/reports", reportUser);

router.get("/:id/blocked", validateUserBlocked, getUserBlockedUsers);
router.post("/:id/blocked", validateUserBlocked, blockUser);
router.delete("/:id/blocked", validateUserBlocked, unblockUser);

router.get("/:id/tags", TagViews.getUserTags);
router.post("/:id/tags", TagViews.addUserTag);
router.delete("/:id/tags", TagViews.deleteUserTag);

router.get("/:id/liked", LikeViews.checkUserLiked);
router.get("/:id/likes", LikeViews.getUserLikes);
router.post("/:id/likes", LikeViews.addUserLike);
router.delete("/:id/likes", LikeViews.deleteUserLike);

router.get("/:id/views", ViewsViews.getUserViews);
router.post("/:id/views", ViewsViews.addUserView);

router.get("/:id/matches", MatchViews.getUserMatches);
router.delete("/:id/matches", MatchViews.deleteUserMatch);

router.get("/:id/images", ImageViews.getUserImages);
router.post("/:id/images", ImageViews.createUserImage);
router.delete("/:id/images", ImageViews.deleteUserImage);
router.put("/:id/images", ImageViews.updateUserImageStatus);
router.get("/:id/images/profile", ImageViews.getUserProfileImage);

export default router;
