import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await API.delete(`/blogs/${id}`);
      navigate("/profile");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("You’re not authorized to delete this blog.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  const isAuthor = user?.id === blog.author?._id;

  return (
    <div className="md:ml-64 px-4">
      {" "}
      {/* Added md:ml-64 for sidebar width */}
      <div className="max-w-3xl mx-auto mt-10 space-y-4">
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-60 object-cover rounded"
          />
        )}
        <h1 className="text-3xl font-bold">{blog.title}</h1>

        {/* Author and dates info */}
        <div className="flex flex-col space-y-2 text-sm text-gray-600">
          <p>By {blog.author?.username}</p>
          <div className="flex space-x-4">
            <div className="bg-gray-100 p-2 rounded">
              <span className="font-medium">Created:</span>{" "}
              {formatDate(blog.createdAt)}
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <span className="font-medium">Last updated:</span>{" "}
              {formatDate(blog.updatedAt)}
            </div>
          </div>
        </div>

        <div className="space-x-2 text-sm">
          {blog.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-4 whitespace-pre-line">{blog.content}</p>

        {isAuthor && (
          <div className="flex gap-4 mt-6">
            <Link
              to={`/edit/${blog._id}`}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
