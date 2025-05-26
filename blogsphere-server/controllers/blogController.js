const Blog = require("../models/blog");

exports.createBlog = async (req, res) => {
  try {
    const { title, content, coverImage, tags } = req.body;
    const blog = await Blog.create({
      title,
      content,
      coverImage,
      tags,
      author: req.user.id,
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create blog", error: err.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching blogs", error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate(
    "author",
    "username"
  );
  if (!blog) return res.status(404).json({ msg: "Blog not found" });
  res.json(blog);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ msg: "Blog not found" });

  if (blog.author.toString() !== req.user.id)
    return res.status(403).json({ msg: "Not authorized" });

  const { title, content, coverImage, tags } = req.body;
  blog.title = title;
  blog.content = content;
  blog.coverImage = coverImage;
  blog.tags = tags;

  await blog.save();
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ msg: "Blog not found" });

  if (blog.author.toString() !== req.user.id)
    return res.status(403).json({ msg: "Not authorized" });

  await blog.deleteOne();
  res.json({ msg: "Blog deleted successfully" });
};

exports.getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user's blogs" });
  }
};
