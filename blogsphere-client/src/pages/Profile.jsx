import { useAuth } from "../context/AuthContext"

export default function Profile() {
  const { user, logout } = useAuth()

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4 text-center">
      <h2 className="text-2xl font-bold">Welcome, {user?.username}</h2>
      <p className="text-gray-600">Email: {user?.email}</p>
      <button onClick={logout} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  )
}
