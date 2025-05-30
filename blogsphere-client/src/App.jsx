import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound.jsx";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import SidePanel from "./components/Sidepanel.jsx";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./pages/BlogDetail";
import EditBlog from "./pages/EditBlog.jsx";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";
import Bookmarks from "./pages/Bookmarks";

function App() {
  return (
    <>
      <Navbar />
      <SidePanel />
      <Routes>
        <Route
          path="/api/create"
          element={
            <PrivateRoute>
              <CreateBlog />
            </PrivateRoute>
          }
        />
        <Route path="/api/" element={<Home />} />
        <Route path="/api/login" element={<Login />} />
        <Route path="/api/register" element={<Register />} />
        <Route
          path="/api/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route path="/api/blogs/:id" element={<BlogDetail />} />
        <Route
          path="/api/edit/:id"
          element={
            <PrivateRoute>
              <EditBlog />
            </PrivateRoute>
          }
        />
        <Route
          path="/api/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/api/user/:userId"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/api/bookmarks"
          element={
            <PrivateRoute>
              <Bookmarks />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
