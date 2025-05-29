import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Bookmarks() {
  const [blogs, setBlogs] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    API.get("/auth/bookmarks")
      .then((res) => setBlogs(res.data))
      .catch(() => setBlogs([]));
  }, []);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="md:ml-64 px-4 mt-10 min-h-screen bg-main transition-colors">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-main">
          🔖 Bookmarked Blogs
        </h2>
        {blogs.length === 0 ? (
          <p className="text-secondary">
            You have not bookmarked any blogs yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-main group"
                onClick={() => (window.location.href = `/blogs/${blog._id}`)}
                style={{ cursor: "pointer" }}
              >
                {blog.coverImage && (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                )}
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-2 text-main">
                    {blog.title}
                  </h2>
                  <p className="text-secondary mb-4 line-clamp-3">
                    {blog.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-secondary">
                    <p className="mb-1">
                      By{" "}
                      <Link
                        to={
                          blog.author?.username === "deleted user"
                            ? "#"
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
                            : (e) => e.stopPropagation()
                        }
                      >
                        {blog.author?.username === "deleted user"
                          ? "deleted user"
                          : blog.author?.username}
                      </Link>
                    </p>
                    <p className="mb-1">
                      Created: {formatDate(blog.createdAt)}
                    </p>
                    {blog.updatedAt !== blog.createdAt && (
                      <p>Last updated: {formatDate(blog.updatedAt)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
