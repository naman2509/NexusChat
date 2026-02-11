import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js"; // Your routes file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS Configuration - IMPORTANT!
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://nexuschat-kxxl.onrender.com' // Add your deployed frontend URL
  ],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection with better error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1); // Exit if DB connection fails
  });

// Routes
app.use("/api", chatRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});