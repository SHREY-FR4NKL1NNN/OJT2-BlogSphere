const express = require("express");
const {
  register,
  login,
  updateProfile,
  deleteAccount,
  followUser,
  unfollowUser,
  getFollowing,
  getUserById,
  uploadAvatar,
  addBookmark,
  removeBookmark,
  getBookmarks,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/avatars"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}); // 2MB limit

router.post("/register", register);
router.post("/login", login);
router.patch("/update", authMiddleware, updateProfile);
router.delete("/delete", authMiddleware, deleteAccount);
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);
router.get("/following", authMiddleware, getFollowing);
router.get("/user/:id", getUserById);
router.post("/avatar", authMiddleware, upload.single("avatar"), uploadAvatar);
router.post("/bookmark/:blogId", authMiddleware, addBookmark);
router.delete("/bookmark/:blogId", authMiddleware, removeBookmark);
router.get("/bookmarks", authMiddleware, getBookmarks);
router.delete("/avatar", authMiddleware, async (req, res) => {
  try {
    const user = await require("../models/user").findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.avatar = "";
    await user.save();
    res.json({ msg: "Avatar removed" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to remove avatar" });
  }
});

module.exports = router;
