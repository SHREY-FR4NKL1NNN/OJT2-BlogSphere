import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./Register.css"

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData)
      login(res.data.user)
      navigate("/")
    } catch (err) {
      console.error(err)
      alert("Registration failed")
    }
  }

  return (
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-body">
          <div className="column" id="main">
            <h1>Sign Up</h1>
            <h3>Create your account to get started</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
          </div>
          <div className="column" id="secondary">
            <div className="sec-content">
              <h2>Welcome Back!</h2>
              <h3>Already have an account?</h3>
              <Link to="/login" className="btn btn-primary">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}