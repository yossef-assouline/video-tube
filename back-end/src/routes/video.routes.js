import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import { publishAVideo,getAllVideos,getVideoById,updateVideo,deleteVideo,togglePublishStatus,getPublishedVideosByChannel} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();
router.use(verifyJWT)
router.route("/publish").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
        
    ]),
    publishAVideo
);
router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideoById).put(upload.single("thumbnail"),updateVideo).delete(deleteVideo);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/u/:userId/published").get(getPublishedVideosByChannel);

// Add OPTIONS handler for preflight requests
router.options('/:videoId', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

export default router;

