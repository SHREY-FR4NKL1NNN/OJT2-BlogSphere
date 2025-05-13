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
