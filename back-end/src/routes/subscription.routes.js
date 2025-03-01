import { Router } from "express";
import { toggleSubscription, getChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

router.use(verifyJWT);

router.route("/c/:channelId").post(toggleSubscription).get(getChannelSubscribers);
router.route("/s/:subscriberId").get(getSubscribedChannels);


export default router;
