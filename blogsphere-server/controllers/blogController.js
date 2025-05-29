const Blog = require("../models/blog");

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    const comment = { user: req.user.id, text };
    blog.comments.push(comment);
    await blog.save();
    await blog.populate("comments.user", "username");
    res.status(201).json(blog.comments[blog.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ msg: "Failed to add comment", error: err.message });
  }
};

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

exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized" });

    comment.text = text;
    await blog.save();
    res.json(comment);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to update comment", error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (
      comment.user.toString() !== req.user.id &&
      blog.author.toString() !== req.user.id
    )
      return res.status(403).json({ msg: "Not authorized" });

    comment.remove();
    await blog.save();
    res.json({ msg: "Comment deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to delete comment", error: err.message });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    if (blog.likes.some((uid) => uid.toString() === req.user.id))
      return res.status(400).json({ msg: "Already liked" });
    blog.likes.push(req.user.id);
    await blog.save();
    res.json({ likes: blog.likes.length });
  } catch (err) {
    res.status(500).json({ msg: "Failed to like blog" });
  }
};

exports.unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    blog.likes = blog.likes.filter((uid) => uid.toString() !== req.user.id);
    await blog.save();
    res.json({ likes: blog.likes.length });
  } catch (err) {
    res.status(500).json({ msg: "Failed to unlike blog" });
  }
};

exports.getBlogLikes = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    const liked = req.user
      ? blog.likes.some((uid) => uid.toString() === req.user.id)
      : false;
    res.json({ likes: blog.likes.length, liked });
  } catch (err) {
    res.status(500).json({ msg: "Failed to get likes" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("comments.user", "username")
      .populate("comments.replies.user", "username");
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    res.json(blog.comments);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch comments", error: err.message });
  }
};

exports.searchBlogs = async (req, res) => {
  try {
    const { q, following, type } = req.query;
    const query = {};

    if (q && q.trim() !== "") {
      if (type === "tags") {
        query.tags = { $regex: q, $options: "i" };
      } else if (type === "user") {
        // Find users whose username matches q
        const User = require("../models/user");
        const users = await User.find({
          username: { $regex: q, $options: "i" },
        }).select("_id");
        if (users.length === 0) {
          return res.json([]); // No matching users, return empty
        }
        query.author = { $in: users.map((u) => u._id) };
      } else if (type === "body") {
        query.content = { $regex: q, $options: "i" };
      } else {
        // Default to title
        query.title = { $regex: q, $options: "i" };
      }
    }

    if (typeof following !== "undefined" && req.user) {
      const User = require("../models/user");
      const user = await User.findById(req.user.id);
      if (following === "true") {
        if (user.following.length > 0) {
          if (query.author && query.author.$in) {
            // Intersect search authors with following
            query.author.$in = query.author.$in.filter((id) =>
              user.following.map((f) => f.toString()).includes(id.toString())
            );
            if (query.author.$in.length === 0) {
              return res.json([]);
            }
          } else {
            query.author = { $in: user.following };
          }
        } else {
          return res.json([]);
        }
      } else if (following === "false") {
        query.author = { $nin: [...user.following, req.user.id] };
      }
    }

    const blogs = await Blog.find(query)
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: "Search failed", error: err.message });
  }
};

exports.personalizedFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const likedBlogs = await Blog.find({ likes: userId });
    const commentedBlogs = await Blog.find({ "comments.user": userId });
    const tagSet = new Set();
    likedBlogs.forEach((b) => b.tags.forEach((t) => tagSet.add(t)));
    commentedBlogs.forEach((b) => b.tags.forEach((t) => tagSet.add(t)));
    const tags = Array.from(tagSet);
    let blogs = [];
    if (tags.length > 0) {
      blogs = await Blog.find({ tags: { $in: tags } })
        .populate("author", "username")
        .sort({ createdAt: -1 });
    }
    if (blogs.length === 0) {
      blogs = await Blog.find()
        .populate("author", "username")
        .sort({ createdAt: -1 });
    }
    res.json(blogs);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Personalized feed failed", error: err.message });
  }
};

exports.replyToComment = async (req, res) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    const reply = { user: req.user.id, text };
    comment.replies.push(reply);
    await blog.save();
    await blog.populate("comments.user", "username");
    await blog.populate("comments.replies.user", "username");
    res.status(201).json(comment.replies[comment.replies.length - 1]);
  } catch (err) {
    res.status(500).json({ msg: "Failed to add reply", error: err.message });
  }
};
