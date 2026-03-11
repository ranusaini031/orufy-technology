import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import userRouter from "./src/routes/authRoutes.js";
import productRouter from "./src/routes/productRoutes.js";
import dbConnect from './src/config/db.js';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL?.split(","),
    credentials: true
}));

app.use(express.json());

app.use("/api/auth", userRouter);
app.use("/api/products", productRouter);

app.get("/", (req, res) => {
    res.send(`Server is running on port ${process.env.PORT || 5000}`);
});

app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Something went wrong"
    });
});

const startServer = async () => {
    try {
        await dbConnect();
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(` Server running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});
