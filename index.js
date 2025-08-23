import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",                   
    "https://frontend-roan-chi-17.vercel.app",
    "https://frontend-dun-tau-46.vercel.app",  
    /^https:\/\/frontend-.*\.vercel\.app$/    
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/hello", (req, res) => {
  res.json({ 
    message: "Hello from backend",
    timestamp: new Date().toISOString(),
    cors: "Configured for Vercel"
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    message: err.message || "Internal server error"
  });
});
app.use("*", (req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.originalUrl
  });
});


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(" MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
