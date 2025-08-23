import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
// import paymentRoutes from "./routes/payment.js";

const app = express();

// 🔧 CORS Configuration - Allow your Vercel frontend
const corsOptions = {
  origin: [
    "http://localhost:3000",                    // Local development
    "https://frontend-roan-chi-17.vercel.app", // Old Vercel deployment
    "https://frontend-dun-tau-46.vercel.app",  // New Vercel deployment
    /^https:\/\/frontend-.*\.vercel\.app$/     // Match any frontend-*.vercel.app
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// 📍 Routes
app.use("/api/auth", authRoutes);
// paymentRoutes(app);

// 🧪 Test route
app.get("/api/hello", (req, res) => {
  res.json({ 
    message: "Hello from backend",
    timestamp: new Date().toISOString(),
    cors: "Configured for Vercel"
  });
});

// 🚫 Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    message: err.message || "Internal server error"
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.originalUrl
  });
});

// 🗄️ Database connection and server start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 CORS enabled for: http://localhost:3000, https://frontend-roan-chi-17.vercel.app`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
