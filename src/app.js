import express from "express"
import cors from "cors"
import healthcheckRouter from "./routes/healthcheck.routes.js"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))



// common middleware
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

//import routes

app.use("/api/v1/healthcheck", healthcheckRouter)

export { app }