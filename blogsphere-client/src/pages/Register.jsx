import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import { auth, googleProvider } from "../services/firebase"
import { signInWithPopup } from "firebase/auth"

export default function Register() {
  const [formData, setFormData] = useState({
    username: "", email: "", password: ""
  })

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post("/auth/register", formData)
      login({ ...res.data.user, token: res.data.token })
      navigate("/")
    } catch (err) {
      alert("Registration failed")
      console.error(err)
    }
  }

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const { user: googleUser } = result
      // Always generate a unique username for Google users
      const baseUsername =
        googleUser.displayName?.replace(/\s+/g, "") ||
        googleUser.email.split("@")[0]
      const uniqueUsername = `${baseUsername}_${googleUser.uid.slice(0, 6)}`
      try {
        const res = await API.post("/auth/register", {
          username: uniqueUsername,
          email: googleUser.email,
          password: googleUser.uid
        })
        login({ ...res.data.user, token: res.data.token })
        navigate("/")
      } catch (err) {
        // If already registered (email or username), fallback to login
        if (
          err?.response?.data?.msg === "User already exists" ||
          err?.response?.data?.error?.includes("duplicate key")
        ) {
          const res = await API.post("/auth/login", {
            email: googleUser.email,
            password: googleUser.uid
          })
          login({ ...res.data.user, token: res.data.token })
          navigate("/")
        } else {
          alert("Google registration failed")
          console.error(err)
        }
      }
    } catch (err) {
      alert("Google registration failed")
      console.error(err)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6">Create a BlogSphere Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Username" className="w-full p-2 border rounded" value={formData.username} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded" value={formData.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded" value={formData.password} onChange={handleChange} />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Register with Google
        </button>
      </div>
    </div>
  )
}
