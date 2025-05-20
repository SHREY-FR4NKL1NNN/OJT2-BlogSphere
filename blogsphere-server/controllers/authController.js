const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ msg: "User already exists" })

    const user = await User.create({ username, email, password })
    const token = generateToken(user)

    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token
    })
  } catch (err) {
    res.status(500).json({ msg: "Registration failed", error: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ msg: "User not found" })

    // Always use bcrypt.compare for all users (including Google)
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" })

    const token = generateToken(user)

    res.status(200).json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token
    })
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { username, password, newPassword } = req.body

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ msg: "User not found" })

    // Update username if provided
    if (username && username !== user.username) {
      user.username = username
    }

    // Update password if both current and new password are provided
    if (password && newPassword) {
      const isMatch = await require("bcryptjs").compare(password, user.password)
      if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" })
      user.password = newPassword
    }

    await user.save()
    res.json({ username: user.username })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Username already taken" })
    }
    res.status(500).json({ msg: "Profile update failed", error: err.message })
  }
}
