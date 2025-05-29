const User = require("../models/user");
const Blog = require("../models/blog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const user = await User.create({ username, email, password });
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, password, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (username && username !== user.username) {
      user.username = username;
    }

    if (password && newPassword) {
      const isMatch = await require("bcryptjs").compare(
        password,
        user.password
      );
      if (!isMatch)
        return res.status(400).json({ msg: "Current password is incorrect" });
      user.password = newPassword;
    }

    await user.save();
    res.json({ username: user.username });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Username already taken" });
    }
    res.status(500).json({ msg: "Profile update failed", error: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const UserModel = require("../models/user");
    const BlogModel = require("../models/blog");

    // Delete all blogs authored by the user
    await BlogModel.deleteMany({ author: userId });

    // Remove user's comments and replies from all blogs
    await BlogModel.updateMany(
      { "comments.user": userId },
      { $pull: { comments: { user: userId } } }
    );
    await BlogModel.updateMany(
      { "comments.replies.user": userId },
      { $pull: { "comments.$[].replies": { user: userId } } }
    );

    // Delete the user document
    await UserModel.findByIdAndDelete(userId);

    res.json({ msg: "Account and all associated blogs/comments deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to delete account", error: err.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.id;
    if (userId === targetId)
      return res.status(400).json({ msg: "Cannot follow yourself" });
    const User = require("../models/user");
    const user = await User.findById(userId);
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ msg: "User not found" });
    if (user.following.includes(targetId))
      return res.status(400).json({ msg: "Already following" });
    user.following.push(targetId);
    target.followers.push(userId);
    await user.save();
    await target.save();
    res.json({ msg: "Followed" });
  } catch (err) {
    res.status(500).json({ msg: "Follow failed", error: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.id;
    const User = require("../models/user");
    const user = await User.findById(userId);
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ msg: "User not found" });
    user.following = user.following.filter((id) => id.toString() !== targetId);
    target.followers = target.followers.filter(
      (id) => id.toString() !== userId
    );
    await user.save();
    await target.save();
    res.json({ msg: "Unfollowed" });
  } catch (err) {
    res.status(500).json({ msg: "Unfollow failed", error: err.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const User = require("../models/user");
    const user = await User.findById(req.user.id).populate(
      "following",
      "username"
    );
    res.json(user.following);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to get following", error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const User = require("../models/user");
    const user = await User.findById(req.params.id).select(
      "_id username email role"
    );
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Failed to get user", error: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });
    const user = await User.findById(req.user.id);
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();
    res.json({ avatar: user.avatar });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to upload avatar", error: err.message });
  }
};

exports.addBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    const blogId = req.params.blogId;
    if (!user.bookmarks.includes(blogId)) {
      user.bookmarks.push(blogId);
      await user.save();
    }
    res.json({ msg: "Bookmarked" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to bookmark", error: err.message });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    const blogId = req.params.blogId;
    user.bookmarks = user.bookmarks.filter((bid) => bid.toString() !== blogId);
    await user.save();
    res.json({ msg: "Bookmark removed" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to remove bookmark", error: err.message });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "bookmarks",
      populate: { path: "author", select: "username" },
    });
    res.json(user.bookmarks);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch bookmarks", error: err.message });
  }
};
