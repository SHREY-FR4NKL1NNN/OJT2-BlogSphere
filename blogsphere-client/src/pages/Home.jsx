import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Home() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
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
    <div className="md:ml-64 px-4 mt-10">
      {" "}
      {/* Added md:ml-64 for sidebar width */}
      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {!user ? (
            <>
              <h1 className="text-4xl font-bold mb-4">
                Welcome to BlogSphere ✨
              </h1>
              <p className="text-gray-600 mb-6">
                Create, share, and discover blogs in your space.
              </p>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-800 text-white px-4 py-2 rounded"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-semibold mb-4">
                Welcome back, {user.username} 👋
              </h1>
              <p className="text-gray-700 mb-4">
                Check out the latest blogs or write your own!
              </p>
              <Link
                to="/create"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Create Blog
              </Link>
            </>
          )}
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="text-center">Loading blogs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                to={`/blogs/${blog._id}`}
                key={blog._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {blog.coverImage && (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Author and Dates */}
                  <div className="text-sm text-gray-500">
                    <p className="mb-1">By {blog.author?.username}</p>
                    <p className="mb-1">
                      Created: {formatDate(blog.createdAt)}
                    </p>
                    {blog.updatedAt !== blog.createdAt && (
                      <p>Last updated: {formatDate(blog.updatedAt)}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
