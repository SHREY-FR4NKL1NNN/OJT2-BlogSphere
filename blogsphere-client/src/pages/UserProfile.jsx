import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const res = await API.get(`/auth/user/${userId}`);
        setProfileUser(res.data);
      } catch {
        setProfileUser(null);
      }
    };
    const fetchBlogs = async () => {
      try {
        const res = await API.get(`/blogs/user/${userId}`);
        setBlogs(res.data);
      } catch {
        setBlogs([]);
      }
    };
    const fetchFollowing = async () => {
      try {
        const res = await API.get("/auth/following");
        setIsFollowing(res.data.some((f) => f._id === userId));
      } catch {
        setIsFollowing(false);
      }
    };
    setLoading(true);
    fetchProfileUser();
    fetchBlogs();
    if (user) fetchFollowing();
    setLoading(false);
    // eslint-disable-next-line
  }, [userId, user]);

  const handleFollow = async () => {
    try {
      await API.post(`/auth/follow/${userId}`);
      setIsFollowing(true);
    } catch {
      alert("Failed to follow user");
    }
  };

  const handleUnfollow = async () => {
    try {
      await API.post(`/auth/unfollow/${userId}`);
      setIsFollowing(false);
    } catch {
      alert("Failed to unfollow user");
    }
  };

  if (loading) return <div className="mt-10 text-center">Loading...</div>;
  if (!profileUser)
    return <div className="mt-10 text-center">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-card rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full border-2 border-blue-400 bg-gray-200 flex items-center justify-center text-5xl text-gray-400 overflow-hidden">
            {/* Show avatar if available, else fallback icon */}
            {profileUser.avatar ? (
              <img
                src={profileUser.avatar}
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span role="img" aria-label="No avatar">
                👤
              </span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2 text-main">
            👤 {profileUser.username}
          </h2>
          <p className="mb-1 text-secondary">
            <strong>Email:</strong> {profileUser.email}
          </p>
          <p className="mb-4 text-secondary">
            <strong>Role:</strong> {profileUser.role}
          </p>
          {user && user.id !== userId && (
            <div className="mb-2">
              {isFollowing ? (
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                  onClick={handleUnfollow}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={handleFollow}
                >
                  Follow
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-main">📝 Blogs</h3>
      {blogs.length === 0 ? (
        <p className="text-secondary">No blogs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-card border border-main rounded-xl shadow hover:shadow-lg transition group"
            >
              <Link to={`/blogs/${blog._id}`}>
                {blog.coverImage && (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="h-40 w-full object-cover rounded-t group-hover:scale-105 transition-transform duration-200"
                  />
                )}
                <div className="p-3">
                  <h4 className="text-lg font-semibold text-main">
                    {blog.title}
                  </h4>
                  <p className="text-sm text-secondary truncate">
                    {blog.content.slice(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {blog.tags?.map((tag, idx) => (
                      <span key={idx} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
