import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Cookie parser must come before cors
app.use(cookieParser());

const corsOptions = {
  origin: ['http://localhost:3000', 'http://https://video-tube-one.vercel.app/'],

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// common middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//import routes
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
// error handling middleware
app.use(errorHandler);

export { app };
