import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import { connectToDb } from './config/db.js'
import cookieParser from 'cookie-parser'
import { v2 as cloudinary } from 'cloudinary'
import cors from 'cors';

const app = express()
app.use(cors());
app.use(express.json({limit:"5mb"}))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)



const port = process.env.PORT
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
    connectToDb()
})