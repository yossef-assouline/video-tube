import { Router } from "express";
import { toggleCommentLike, toggleVideoLike, getLikedVideos } from "../controllers/like.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/videos").get(getLikedVideos);

export default router;
