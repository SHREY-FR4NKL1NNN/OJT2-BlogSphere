import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SidePanel() {
  const { user } = useAuth();

  if (!user) return null; // hide if not logged in

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 h-[calc(100vh-4rem)] pt-4 px-6 pb-8 bg-card border-r border-main fixed left-0 z-10 transition-colors shadow-lg">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          {user.avatar && (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
            />
          )}
          <div>
            <div className="font-bold text-lg text-main">{user.username}</div>
            <div className="text-xs text-secondary">{user.email}</div>
          </div>
        </div>
      </div>
      <nav className="space-y-2 flex-1">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary pl-2">
          Main
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-main hover:bg-blue-100 hover:text-blue-700 hover:[&>*]:text-blue-700 transition"
        >
          <span role="img" aria-label="Home">
            🏠
          </span>{" "}
          Home
        </Link>
        <Link
          to="/create"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-main hover:bg-blue-100 hover:text-blue-700 hover:[&>*]:text-blue-700 transition"
        >
          <span role="img" aria-label="Create">
            ✍️
          </span>{" "}
          Create Blog
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-main hover:bg-blue-100 hover:text-blue-700 hover:[&>*]:text-blue-700 transition"
        >
          <span role="img" aria-label="Profile">
            👤
          </span>{" "}
          Profile
        </Link>
        <Link
          to="/bookmarks"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-main hover:bg-blue-100 hover:text-blue-700 hover:[&>*]:text-blue-700 transition"
        >
          <span role="img" aria-label="Bookmarks">
            🔖
          </span>{" "}
          Bookmarks
        </Link>
      </nav>
      <div className="mt-auto pt-6 border-t border-main">
        <Link
          to="/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-secondary transition text-sm
            hover:bg-red-100
            hover:text-blue-700 hover:[&>*]:text-blue-700
            dark:hover:bg-red-900"
        >
          <span role="img" aria-label="Settings">
            ⚙️
          </span>{" "}
          Settings
        </Link>
      </div>
    </aside>
  );
}
