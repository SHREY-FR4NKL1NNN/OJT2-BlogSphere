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
    "https://ojt2-blogsphere-1.onrender.com", // your frontend URL
    "http://localhost:5173" // local dev, if needed
  ],
  credentials: true, // if you use cookies or need credentials
};
app.use(cors(corsOptions));
app.use(express.json())

// Ensure upload directories exist
fs.mkdirSync(path.join(__dirname, "uploads/avatars"), { recursive: true })
fs.mkdirSync(path.join(__dirname, "uploads/blogs"), { recursive: true })

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
const authRoutes = require("./routes/authRoutes")
app.use("/api/auth", authRoutes)

// Register blogRoutes BEFORE starting the server
const blogRoutes = require("./routes/blogRoutes")
app.use("/api/blogs", blogRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
  })
  .catch(err => console.error("MongoDB connection error:", err))
