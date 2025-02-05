import { Router } from "express"
import { registerUser, findUser } from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js"
const router = Router()

router.route("/register").post(upload.fields([{name:"avatar", maxCount:1}, {name:"coverImage", maxCount:1}]), registerUser)
router.route("/find").get(findUser)
export default router