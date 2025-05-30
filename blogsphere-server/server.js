const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const fs = require("fs")
const path = require("path")

dotenv.config()

const app = express()

const corsOptions = {
  origin: [
    "https://ojt2-blogsphere-1.onrender.com",
    "http://localhost:5173"
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json())

// Ensure upload directories exist
fs.mkdirSync(path.join(__dirname, "uploads/avatars"), { recursive: true })
fs.mkdirSync(path.join(__dirname, "uploads/blogs"), { recursive: true })

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// API Routes
const authRoutes = require("./routes/authRoutes")
app.use("/api/auth", authRoutes)
const blogRoutes = require("./routes/blogRoutes")
app.use("/api/blogs", blogRoutes)

// Serve static files from the React app
const clientBuildPath = path.join(__dirname, "../blogsphere-client/dist");
app.use(express.static(clientBuildPath));

// Catch-all: send back React's index.html for any non-API, non-upload route
app.get("*", (req, res) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return res.status(404).json({ msg: "Not Found" });
  }
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
  })
  .catch(err => console.error("MongoDB connection error:", err))