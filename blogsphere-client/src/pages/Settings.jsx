import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import { useState } from "react"

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return
    setLoading(true)
    try {
      await API.delete("/auth/delete")
      logout()
      navigate("/register")
    } catch (err) {
      alert("Failed to delete account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete My Account"}
        </button>
      </div>
    </div>
  )
}
