import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function SidePanel() {
  const { user } = useAuth()

  if (!user) return null // hide if not logged in

  return (
    <aside className="hidden md:block md:w-64 h-full px-4 py-6 bg-gray-100 border-r fixed top-16 left-0">
      <nav className="space-y-4">
        <Link to="/" className="block text-gray-800 hover:text-blue-600">🏠 Home</Link>
        <Link to="/create" className="block text-gray-800 hover:text-blue-600">✍️ Create Blog</Link>
        <Link to="/profile" className="block text-gray-800 hover:text-blue-600">👤 Profile</Link>
        {/* Add more links like Bookmarks, Dashboard later */}
      </nav>
    </aside>
  )
}
