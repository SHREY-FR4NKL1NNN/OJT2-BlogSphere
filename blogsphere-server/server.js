const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require("./routes/authRoutes")
app.use("/api/auth", authRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
  })
  .catch(err => console.error("MongoDB connection error:", err))
