import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">BlogSphere</Link>
      <div className="space-x-4 flex items-center">
        {!user ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
          </>
        ) : (
          <>
            {user.avatar && (
              <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover inline-block mr-2" />
            )}
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">
              {user.username}
            </Link>
            <button onClick={handleLogout} className="text-red-600 hover:underline">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
