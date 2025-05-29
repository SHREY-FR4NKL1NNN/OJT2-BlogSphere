import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function SidePanel() {
  const { user } = useAuth()

  if (!user) return null // hide if not logged in

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 h-[calc(100vh-4rem)] px-4 py-6 bg-gray-100 border-r fixed top-16 left-0">
      <nav className="space-y-4 flex-1">
        <Link to="/" className="block text-gray-800 hover:text-blue-600">🏠 Home</Link>
        <Link to="/create" className="block text-gray-800 hover:text-blue-600">✍️ Create Blog</Link>
        <Link to="/profile" className="block text-gray-800 hover:text-blue-600">👤 Profile</Link>
        {/* Add more links like Bookmarks, Dashboard later */}
      </nav>
      <div className="mt-auto pb-2">
        <Link to="/settings" className="block text-gray-600 hover:text-blue-600 text-sm">
          ⚙️ Settings
        </Link>
      </div>
    </aside>
  )
}
