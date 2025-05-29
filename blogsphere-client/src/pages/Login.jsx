import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { auth, googleProvider } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      login({ ...res.data.user, token: res.data.token }); // save user + token
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user: googleUser } = result;
      let res;
      try {
        res = await API.post("/auth/login", {
          email: googleUser.email,
          password: googleUser.uid,
        });
      } catch (err) {
        // If not found, register with unique username
        const baseUsername =
          googleUser.displayName?.replace(/\s+/g, "") ||
          googleUser.email.split("@")[0];
        const uniqueUsername = `${baseUsername}_${googleUser.uid.slice(0, 6)}`;
        res = await API.post("/auth/register", {
          username: uniqueUsername,
          email: googleUser.email,
          password: googleUser.uid,
        });
      }
      login({ ...res.data.user, token: res.data.token });
      navigate("/");
    } catch (err) {
      alert("Google login failed");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6">Login to BlogSphere</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
