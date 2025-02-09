import { Router } from "express";
import { registerUser, findUser, loginUser, refreshAccessToken, logoutUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.route("/find").get(findUser);
//secure routes
router.route("/login").post(loginUser);
router.route("/refresh").get(verifyJWT, refreshAccessToken);
router.route("/logout").post(verifyJWT, logoutUser);
export default router;
