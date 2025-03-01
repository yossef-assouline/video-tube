import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.use(verifyJWT)

router.route("/:videoId").get(getVideoComments).post(addComment)

router.route("/c/:commentId").patch(updateComment).delete(deleteComment)

export default router

