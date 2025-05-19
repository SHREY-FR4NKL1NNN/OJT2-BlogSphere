import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./Register.css"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData)
      login(res.data.user)
      navigate("/")
    } catch (err) {
      console.error(err)
      alert("Invalid credentials")
    }
  }

  return (
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-body">
          <div className="column" id="main">
            <h1>Login</h1>
            <h3>Welcome back to BlogSphere</h3>
            <form onSubmit={handleSubmit}>
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
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
          </div>
          <div className="column" id="secondary">
            <div className="sec-content">
              <h2>Hello, Friend!</h2>
              <h3>New to BlogSphere?</h3>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}