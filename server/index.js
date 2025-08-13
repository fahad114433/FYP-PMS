// Packages
import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import cors from "cors"
import rateLimit from "express-rate-limit"

// Files
import connectDB from "./config/db.js"
import userRoutes from './Routes/userRoutes.js'
import projectRoutes from './Routes/projectRoutes.js'
import moduleRoutes from "./Routes/moduleRoutes.js"
import teamRoutes from './Routes/teamRoutes.js'
import taskRoutes from './Routes/taskRoutes.js'
import adminRoutes from './Routes/adminRoutes.js'

const app = express()
const port = process.env.PORT || 5000
dotenv.config()

// Rate Limiter Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
})
app.use(limiter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}))

// Routes
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/modules', moduleRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/dashboard', adminRoutes)

app.get('/', (req, res) => {
    res.send("<h1>Backend is running successfully.</h1>")
})

connectDB()
app.listen(port, () => {
    console.log(`Listening on port http://localhost:5000`)
})
