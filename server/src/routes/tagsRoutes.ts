import express, { Router } from "express";
import * as TagViews from "@views/tagViews";

const router: Router = express.Router();

router.get("/", TagViews.getAllTags);

export default router;