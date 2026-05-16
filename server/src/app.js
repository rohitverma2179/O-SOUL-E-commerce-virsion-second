import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"

const app = express()

// Security Headers
app.use(helmet())

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Body parsers
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes import
import userRouter from './routes/user.routes.js'
import adminRouter from './routes/admin.routes.js'

// Routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/admin", adminRouter)

export { app }
