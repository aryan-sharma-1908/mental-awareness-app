import React, { createContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5143";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  // hydrate initial values from localStorage for instant UI restore
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    try {
      return localStorage.getItem("avatar") || "/boy.png";
    } catch (e) {
      return "/boy.png";
    }
  });
  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem("username") || "";
    } catch (e) {
      return "";
    }
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important for cookies
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setUsername(data.user.username);
        setSelectedAvatar(data.user.avatar || "/boy.png");
        setIsAuthenticated(true);

        // Keep for quick UI restore
        localStorage.setItem("username", data.user.username || "");
        localStorage.setItem("avatar", data.user.avatar || "/boy.png");
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error while fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogOut = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setIsAuthenticated(false);
        setUser(null);
        setUsername("");
        setSelectedAvatar("/boy.png");
        localStorage.removeItem("avatar");
        localStorage.removeItem("username");
        toast.success("Logged Out Successfully!");
        navigate("/login");
      } else {
        console.log("Failed to logout:", await res.text());
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        selectedAvatar,
        setSelectedAvatar,
        username,
        setUsername,
        user,
        setUser,
        fetchUser,
        handleLogOut,
        isLoading,
      }}
    >
      <ToastContainer/>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
