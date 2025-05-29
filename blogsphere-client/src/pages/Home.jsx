import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [showFollowing, setShowFollowing] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(0);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let res;
      const params = new URLSearchParams();
      if (search) {
        params.append("q", search);
        params.append("type", searchType);
      }
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

  // Only fetch on mount, search button, or showFollowing toggle
  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, [triggerSearch, showFollowing, user]);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const handleSearch = (e) => {
    e?.preventDefault();
    setTriggerSearch((c) => c + 1);
  };

  const handleShowFollowing = () => {
    setShowFollowing((f) => !f);
    setTriggerSearch((c) => c + 1);
  };

  return (
    <div
      className={`${
        user ? "md:ml-64" : ""
      } px-4 mt-10 min-h-screen bg-main transition-colors`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Search & Filter */}
        <form
          className="flex flex-col md:flex-row gap-4 mb-8 items-center"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder={`Search blogs by ${searchType}...`}
            className="border p-2 rounded w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="title" className="capitalize text-gray-600">
              Title
            </option>
            <option value="body" className="capitalize text-gray-600">
              Body
            </option>
            <option value="tags" className="capitalize text-gray-600">
              Tags
            </option>
            <option value="user" className="capitalize text-gray-600">
              User
            </option>
          </select>
          {user && (
            <button
              type="button"
              className={`px-4 py-2 rounded ${
                showFollowing
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={handleShowFollowing}
            >
              {showFollowing ? "Show All Blogs" : "Show Following"}
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </form>

        {/* Blogs Grid */}
        {loading ? (
          <div className="text-center">Loading blogs...</div>
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
                            : blog.author?._id === user?.id
                            ? undefined
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
