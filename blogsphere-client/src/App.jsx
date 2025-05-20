import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import NotFound from "./pages/NotFound.jsx"
import PrivateRoute from "./components/PrivateRoute"
import Navbar from "./components/Navbar"
import SidePanel from "./components/Sidepanel.jsx"
import CreateBlog from "./pages/CreateBlog"
import BlogDetail from "./pages/BlogDetail"
import EditBlog from "./pages/EditBlog.jsx"

function App() {
  return (
    <>
    <Navbar />
    <SidePanel />
    <Routes>
      <Route path="/create" element={<PrivateRoute><CreateBlog /></PrivateRoute>}/>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="*" element={<NotFound />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/edit/:id" element={<PrivateRoute><EditBlog /></PrivateRoute>}/>
    </Routes>
    </>
  )
}

export default App
