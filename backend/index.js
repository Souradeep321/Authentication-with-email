import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path'

import connectDb from './db/connection.js'

dotenv.config({
    path: 'backend/.env'
})

const app = express()
const port = process.env.PORT || 4000;
const __dirname = path.resolve();

app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
);
// common middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

// import routes 
import authRoutes from './routes/auth.routes.js' 

// routes middleware
app.use('/api/v1/auth', authRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}
// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Error middleware caught:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});


connectDb().
    then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port http://localhost:${port}`);
        })
    }).catch((error) => {
        console.log("Failed to connect to database ", error);
    })
