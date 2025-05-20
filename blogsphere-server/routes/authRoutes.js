const express = require("express")
const { register, login, updateProfile } = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.patch("/update", authMiddleware, updateProfile)

module.exports = router
