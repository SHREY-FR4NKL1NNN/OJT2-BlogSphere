import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Home() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFollowing, setShowFollowing] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let res;
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (user && showFollowing) {
        params.append("following", "true");
      }
      if (params.toString()) {
        res = await API.get(`/blogs/search?${params.toString()}`);
      } else {
        res = await API.get("/blogs");
      }
      setBlogs(res.data);
    } catch (err) {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, [user, search, showFollowing]);

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
      <div className="max-w-7xl mx-auto">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <input
            type="text"
            placeholder="Search blogs by title..."
            className="border p-2 rounded w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {user && (
            <button
              className={`px-4 py-2 rounded ${
                showFollowing
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setShowFollowing((f) => !f)}
            >
              {showFollowing ? "Show All Blogs" : "Show Following"}
            </button>
          )}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={fetchBlogs}
          >
            Search
          </button>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="text-center">Loading blogs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                onClick={() => (window.location.href = `/blogs/${blog._id}`)}
                style={{ cursor: "pointer" }}
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
                    <p className="mb-1">
                      By{" "}
                      <Link
                        to={`/user/${blog.author?._id}`}
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {blog.author?.username}
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
