const express = require("express")
const router = express.Router()
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByUser,

} = require("../controllers/blogController")

const authMiddleware = require("../middleware/authMiddleware")

router.get("/", getBlogs)
router.get("/:id", getBlogById) 
router.post("/", authMiddleware, createBlog)
router.put("/:id", authMiddleware, updateBlog)
router.delete("/:id", authMiddleware, deleteBlog)
router.get("/user/:userId", getBlogsByUser)


module.exports = router
