import express, { Router } from "express";
import * as UserViews from "@views/userViews";

const router: Router = express.Router();

router.get("/", UserViews.getUsers);
router.get("/:id", UserViews.getUserById);
router.get("/:id/tags", UserViews.getUserTags);
router.post("/:id/tags", UserViews.addUserTag);
router.delete("/:id/tags", UserViews.deleteUserTag);

export default router;
