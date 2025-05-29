import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await API.get(`/blogs/${id}/comments`);
        setComments(res.data);
      } catch (err) {
        setComments([]);
      }
    };

    const fetchLikes = async () => {
      if (user) {
        try {
          const res = await API.get(`/blogs/${id}/likes`);
          setLikes(res.data.likes);
          setLiked(res.data.liked);
        } catch {
          setLikes(0);
          setLiked(false);
        }
      } else {
        try {
          const res = await API.get(`/blogs/${id}`);
          setLikes(res.data.likes ? res.data.likes.length : 0);
          setLiked(false);
        } catch {
          setLikes(0);
        }
      }
    };

    // Check if bookmarked from backend
    const checkBookmarked = async () => {
      if (!user) return setBookmarked(false);
      try {
        const res = await API.get("/auth/bookmarks");
        setBookmarked(res.data.some((b) => b._id === id));
      } catch {
        setBookmarked(false);
      }
    };
    checkBookmarked();

    fetchBlog();
    fetchComments();
    fetchLikes();
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await API.delete(`/blogs/${id}`);
      navigate("/profile");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("You’re not authorized to delete this blog.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await API.post(`/blogs/${id}/comments`, { text: commentText });
      const res = await API.get(`/blogs/${id}/comments`);
      setComments(res.data);
      setCommentText("");
    } catch (err) {
      alert("Failed to add comment");
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const res = await API.put(`/blogs/${id}/comments/${commentId}`, {
        text: editingText,
      });
      setComments(
        comments.map((c) =>
          c._id === commentId ? { ...c, text: res.data.text } : c
        )
      );
      setEditingCommentId(null);
      setEditingText("");
    } catch (err) {
      alert("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/blogs/${id}/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      if (liked) {
        const res = await API.post(`/blogs/${id}/unlike`);
        setLikes(res.data.likes);
        setLiked(false);
      } else {
        const res = await API.post(`/blogs/${id}/like`);
        setLikes(res.data.likes);
        setLiked(true);
      }
    } catch (err) {
      alert("Failed to update like");
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      await API.post(`/blogs/${id}/comments/${commentId}/replies`, {
        text: replyText,
      });
      // Refresh comments to show new reply
      const res = await API.get(`/blogs/${id}/comments`);
      setComments(res.data);
      setReplyingTo(null);
      setReplyText("");
    } catch (err) {
      alert("Failed to add reply");
    }
  };

  const handleBookmark = async () => {
    if (!user) return;
    try {
      if (bookmarked) {
        await API.delete(`/auth/bookmark/${id}`);
        setBookmarked(false);
      } else {
        await API.post(`/auth/bookmark/${id}`);
        setBookmarked(true);
      }
    } catch {
      alert("Failed to update bookmark");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  const isAuthor = user?.id === blog.author?._id;

  return (
    <div
      className={`md:ml-64 px-4 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}
    >
      <div className="max-w-3xl mx-auto mt-10 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-60 object-cover rounded"
          />
        )}
        <h1 className="text-3xl font-bold">{blog.title}</h1>

        {/* Author and dates info */}
        <div className="flex flex-col space-y-2 text-sm text-gray-600">
          <p>
            By{" "}
            <Link
              to={
                blog.author?.username === "deleted user"
                  ? "#"
                  : blog.author?._id === user?.id
                  ? "/profile"
                  : `/user/${blog.author?._id}`
              }
              className={`${
                blog.author?.username === "deleted user"
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:underline"
              }`}
              onClick={
                blog.author?.username === "deleted user"
                  ? (e) => e.preventDefault()
                  : undefined
              }
            >
              {blog.author?.username === "deleted user"
                ? "deleted user"
                : blog.author?.username}
            </Link>
          </p>
          <div className="flex space-x-4">
            <div className="bg-gray-100 p-2 rounded">
              <span className="font-medium">Created:</span>{" "}
              {formatDate(blog.createdAt)}
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <span className="font-medium">Last updated:</span>{" "}
              {formatDate(blog.updatedAt)}
            </div>
          </div>
        </div>

        <div className="space-x-2 text-sm">
          {blog.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-4 whitespace-pre-line">{blog.content}</p>

        {/* Like button and count */}
        <div className="flex items-center gap-2 mt-2">
          <button
            className={`px-3 py-1 rounded ${
              liked
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            } transition`}
            onClick={handleLike}
            disabled={!user}
            title={user ? (liked ? "Unlike" : "Like") : "Login to like"}
          >
            {liked ? "💙 Liked" : "🤍 Like"}
          </button>
          <span className="text-gray-700 dark:text-gray-200">
            {likes} {likes === 1 ? "like" : "likes"}
          </span>
          <button
            className={`ml-4 px-3 py-1 rounded ${
              bookmarked
                ? "bg-yellow-400 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            } transition`}
            onClick={handleBookmark}
            title={bookmarked ? "Remove Bookmark" : "Bookmark this blog"}
          >
            {bookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">💬 Comments</h3>
          {user && (
            <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 border p-2 rounded"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Post
              </button>
            </form>
          )}
          <div className="space-y-3">
            {comments.length === 0 && (
              <p className="text-gray-500">No comments yet.</p>
            )}
            {comments.map((comment) => {
              const isCommentAuthor =
                user &&
                comment.user &&
                user.id === (comment.user._id || comment.user);
              const isBlogAuthor =
                user &&
                blog.author &&
                user.id === (blog.author._id || blog.author);
              return (
                <div key={comment._id} className="border rounded p-2 mb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold">
                        <Link
                          to={
                            comment.user?.username === "deleted user"
                              ? "#"
                              : comment.user?._id === user?.id
                              ? "/profile"
                              : `/user/${comment.user?._id || comment.user}`
                          }
                          className={`${
                            comment.user?.username === "deleted user"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-600 hover:underline"
                          }`}
                          onClick={
                            comment.user?.username === "deleted user"
                              ? (e) => e.preventDefault()
                              : undefined
                          }
                        >
                          {comment.user?.username === "deleted user"
                            ? "deleted user"
                            : comment.user?.username || "User"}
                        </Link>
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                      {editingCommentId === comment._id ? (
                        <div className="mt-1 flex gap-2">
                          <input
                            className="border rounded p-1 flex-1"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                          />
                          <button
                            className="bg-green-600 text-white px-2 py-1 rounded"
                            onClick={() => handleSaveEdit(comment._id)}
                            type="button"
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-400 text-white px-2 py-1 rounded"
                            onClick={() => setEditingCommentId(null)}
                            type="button"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="mt-1">{comment.text}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-2">
                      {(isCommentAuthor || isBlogAuthor) && (
                        <button
                          className="text-red-600 text-xs"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </button>
                      )}
                      {isCommentAuthor && (
                        <button
                          className="text-blue-600 text-xs"
                          onClick={() => handleEditComment(comment)}
                          disabled={editingCommentId === comment._id}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="text-xs text-green-600"
                        onClick={() => {
                          setReplyingTo(comment._id);
                          setReplyText("");
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  {/* Replies */}
                  <div className="ml-6 mt-2 space-y-2">
                    {comment.replies &&
                      comment.replies.map((reply) => (
                        <div key={reply._id} className="border-l-2 pl-2">
                          <span className="font-semibold">
                            <Link
                              to={
                                reply.user?.username === "deleted user"
                                  ? "#"
                                  : reply.user?._id === user?.id
                                  ? "/profile"
                                  : `/user/${reply.user?._id || reply.user}`
                              }
                              className={`${
                                reply.user?.username === "deleted user"
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-blue-600 hover:underline"
                              }`}
                              onClick={
                                reply.user?.username === "deleted user"
                                  ? (e) => e.preventDefault()
                                  : undefined
                              }
                            >
                              {reply.user?.username === "deleted user"
                                ? "deleted user"
                                : reply.user?.username || "User"}
                            </Link>
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                          <p className="mt-1">{reply.text}</p>
                        </div>
                      ))}
                    {replyingTo === comment._id && (
                      <form
                        className="flex gap-2 mt-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleReply(comment._id);
                        }}
                      >
                        <input
                          type="text"
                          className="flex-1 border p-1 rounded"
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Reply
                        </button>
                        <button
                          type="button"
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancel
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {isAuthor && (
          <div className="flex gap-4 mt-6">
            <Link
              to={`/edit/${blog._id}`}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
