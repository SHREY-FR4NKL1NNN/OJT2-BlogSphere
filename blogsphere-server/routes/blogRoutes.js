const express = require("express")
const router = express.Router()
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByUser,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  likeBlog,
  unlikeBlog,
  getBlogLikes,
  searchBlogs,
  personalizedFeed,
  replyToComment
} = require("../controllers/blogController")

const authMiddleware = require("../middleware/authMiddleware")
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/blogs"))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false)
  }
  cb(null, true)
}
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

router.get("/", getBlogs)
router.get("/:id", getBlogById) 
router.post("/", authMiddleware, createBlog)
router.put("/:id", authMiddleware, updateBlog)
router.delete("/:id", authMiddleware, deleteBlog)
router.get("/user/:userId", getBlogsByUser)
router.post("/:id/comments", authMiddleware, addComment)
router.get("/:id/comments", getComments)
router.put("/:id/comments/:commentId", authMiddleware, updateComment)
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment)
router.post("/:id/like", authMiddleware, likeBlog)
router.post("/:id/unlike", authMiddleware, unlikeBlog)
router.get("/:id/likes", authMiddleware, getBlogLikes)
router.get("/search", searchBlogs)
router.get("/feed/personalized", authMiddleware, personalizedFeed)
router.post("/:id/comments/:commentId/replies", authMiddleware, replyToComment)
router.post("/upload-image", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded or invalid file type/size" })
  res.json({ url: `/uploads/blogs/${req.file.filename}` })
})

module.exports = router
