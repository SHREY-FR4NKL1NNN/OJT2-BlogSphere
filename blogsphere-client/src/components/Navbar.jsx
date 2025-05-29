import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-card shadow-md border-b border-main px-6 py-3 flex justify-between items-center transition-colors z-20">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-600 tracking-tight"
        >
          <span role="img" aria-label="Home">
            🏠
          </span>
          BlogSphere
        </Link>
      </div>
      <div className="space-x-4 flex items-center">
        <button
          onClick={toggleTheme}
          className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          title="Toggle light/dark mode"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        {!user ? (
          <>
            <Link
              to="/login"
              className="text-main hover:text-blue-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-main hover:text-blue-600 font-medium"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {user.avatar && (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover inline-block mr-2 border-2 border-blue-400"
              />
            )}
            <Link
              to="/profile"
              className="text-main hover:text-blue-600 font-semibold"
            >
              {user.username}
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
