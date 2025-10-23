import React, { useEffect, useState, useContext } from "react";
import { MessageCircle, Users, Heart } from "lucide-react";
import { LoginContext } from "../App";
import { toast, ToastContainer, Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { AuthContext } from "../components/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5143";

export function Community() {
  const { isAuthenticated } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const navigate = useNavigate();

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/community`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch posts!");
      const data = await res.json();

      if (!data?.posts?.length) {
        console.log("No posts to be fetched.");
      } else {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() || !title.trim()) {
      console.log('Please provide title and text');
      return;
}
    if (!isAuthenticated) {
      toast.warn("User must be logged in to post!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      console.log('User is not logged in please login first to post!');
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/community`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, text }),
      });

      const data = await response.json();
      if (response.ok) {
        setPosts([...posts, data]);
        setTitle("");
        setText("");
      }
      toast.success('Post created!');
      fetchPosts();
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(errData.message || "Failed to post!", { autoClose: 1500 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ToastContainer />
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Community Support
          </h1>
          <p className="text-lg text-gray-600">
            A safe space to share your thoughts and connect with others on their
            mental wellness journey.
          </p>
        </div>

        {/* Post form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <TextField
              placeholder="Enter Title..."
              variant="outlined"
              className="!mb-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "gray",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "gray",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a855f7",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#a855f7",
                },
              }}
            />
            <TextField
              placeholder="Enter Text..."
              multiline
              rows={3}
              className="!mb-2 w-full"
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "gray",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "gray",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a855f7",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#a855f7",
                },
              }}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Share Anonymously
              </button>
            </div>
          </form>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post, id) => (
              <div className="bg-white w-full p-6 rounded-md" key={id}>
                <h2 className="font-bold text-[24px]">{post.title}</h2>
                <p className="text-[18px]">{post.text}</p>
                {post.user && (
                  <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <img
                      src={post.user.avatar || "/boy.png"}
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    <span>
                      Posted by {post.user.username}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
