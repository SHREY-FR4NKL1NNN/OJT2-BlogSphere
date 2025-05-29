import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    username: user.username,
    password: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState([]);
  const [avatar, setAvatar] = useState(
    user.avatar ? getFullUrl(user.avatar) : ""
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get(`/blogs/user/${user.id}`);
        setBlogs(res.data);
      } catch (err) {
        setBlogs([]);
      }
    };
    const fetchFollowing = async () => {
      try {
        const res = await API.get("/auth/following");
        setFollowing(res.data);
      } catch {}
    };
    const fetchBookmarked = async () => {
      try {
        const res = await API.get("/auth/bookmarks");
        setBookmarkedBlogs(res.data);
      } catch {
        setBookmarkedBlogs([]);
      }
    };
    fetchBlogs();
    fetchFollowing();
    fetchBookmarked();
  }, [user.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setForm({
      username: user.username,
      password: "",
      newPassword: "",
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      username: user.username,
      password: "",
      newPassword: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        username: form.username,
      };
      if (form.password && form.newPassword) {
        payload.password = form.password;
        payload.newPassword = form.newPassword;
      }
      const res = await API.patch("/auth/update", payload);
      login({ ...user, username: res.data.username }); // update username in context
      setEditMode(false);
      alert("Profile updated!");
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      const res = await API.post("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const avatarUrl = getFullUrl(res.data.avatar);
      setAvatar(avatarUrl);
      setAvatarPreview(null);
      setAvatarFile(null);
      login({ ...user, avatar: avatarUrl });
      alert("Avatar updated!");
    } catch {
      alert("Failed to upload avatar");
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatar("");
    setAvatarPreview(null);
    setAvatarFile(null);
    try {
      await API.delete("/auth/avatar"); // call backend to remove avatar from DB
      login({ ...user, avatar: "" });
      alert("Avatar removed!");
    } catch {
      alert("Failed to remove avatar");
    }
  };

  function getFullUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    // Adjust the base URL if needed
    return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${path}`;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-card rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">👤 {user.username}'s Profile</h2>
        <button
          onClick={toggleTheme}
          className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          title="Toggle light/dark mode"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="relative">
          {avatarPreview ? (
            <>
              <img
                src={avatarPreview}
                alt="avatar preview"
                className="w-20 h-20 rounded-full object-cover border border-main"
              />
              <button
                type="button"
                onClick={() => {
                  setAvatarPreview(null);
                  setAvatarFile(null);
                }}
                className="absolute top-0 left-0 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition"
                title="Remove selected image"
                style={{ fontSize: "1rem" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          ) : avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border border-main"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border border-main bg-gray-200 flex items-center justify-center text-4xl text-gray-400">
              <span role="img" aria-label="No avatar">
                👤
              </span>
            </div>
          )}
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer shadow hover:bg-blue-700 transition"
            title="Upload avatar"
            style={{ fontSize: "1rem" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 20h14M12 4v16m8-8H4"
              />
            </svg>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{ width: "100%", height: "100%" }}
            />
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={handleAvatarUpload}
            type="button"
            disabled={!avatarFile}
          >
            Upload Avatar
          </button>
          {/* Only show remove button if an avatar is already uploaded (not just preview) */}
          {avatar && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="bg-red-600 text-white px-3 py-1 rounded"
              title="Remove avatar"
            >
              Remove Avatar
            </button>
          )}
        </div>
      </div>
      <p className="mb-2">
        <strong>Email:</strong> {user.email}
      </p>
      <p className="mb-6">
        <strong>Role:</strong> {user.role}
      </p>

      {!editMode ? (
        <button
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleEdit}
        >
          Edit Profile
        </button>
      ) : (
        <form onSubmit={handleUpdate} className="mb-6 space-y-4 max-w-sm">
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              className="w-full border p-2 rounded"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Current Password</label>
            <input
              type="password"
              name="password"
              className="w-full border p-2 rounded"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter current password to change password"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="w-full border p-2 rounded"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <h3 className="text-2xl font-semibold mb-4">👥 Following</h3>
      <ul className="mb-6">
        {following.length === 0 ? (
          <li>You are not following anyone yet.</li>
        ) : (
          following.map((f) => (
            <li key={f._id}>
              <Link
                to={`/user/${f._id}`}
                className="text-blue-600 hover:underline"
              >
                {f.username}
              </Link>
            </li>
          ))
        )}
      </ul>

      <h3 className="text-2xl font-semibold mb-4">📝 Your Blogs</h3>
      {blogs.length === 0 ? (
        <p>You haven’t posted anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow hover:shadow-lg transition group"
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
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {blog.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {blog.content.slice(0, 100)}...
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-2xl font-semibold mb-4 mt-8">🔖 Bookmarked Blogs</h3>
      {bookmarkedBlogs.length === 0 ? (
        <p>
          You have not bookmarked any blogs yet.{" "}
          <Link to="/bookmarks" className="text-blue-600 hover:underline">
            View Bookmarks
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bookmarkedBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow hover:shadow-lg transition group"
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
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {blog.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {blog.content.slice(0, 100)}...
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
