import React, { useContext, useState, useEffect } from "react";
import { MdEdit, MdLogout } from "react-icons/md";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Mail, Calendar, Award } from "lucide-react";
import BASE_URL from "../config";
const Profile = () => {
  const { selectedAvatar, username, user, isAuthenticated, handleLogOut, setUsername } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(username);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleEditUsername = async () => {
    if (!editUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    if (editUsername === username) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: editUsername }),
      });
      const data = await response.json();
      if (response.ok) {
        setUsername(editUsername);
        toast.success("Username updated successfully");
      }

      toast.success("Username updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("Failed to update username");
    }
  };

  const handleLogout = () => {
    handleLogOut();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="avatar-wrapper rounded-full overflow-hidden w-[120px] h-[120px] border-4 border-purple-600 shadow-lg mb-4">
              <img
                src={selectedAvatar || "/boy.png"}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => navigate("/profile/setup")}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-2"
            >
              <MdEdit className="w-4 h-4" />
              Change Avatar
            </button>
          </div>

          {/* Username Section */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600 text-sm font-medium">Username</span>
              </div>
            </div>

            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
                <button
                  onClick={handleEditUsername}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditUsername(username);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{username}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition"
                >
                  <MdEdit className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Email Section */}
          {user?.email && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600 text-sm font-medium">Email</span>
              </div>
              <p className="text-lg text-gray-900 ml-8">{user.email}</p>
            </div>
          )}

          {/* Account Stats */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Member Since */}
              {user?.createdAt && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Member Since</span>
                  </div>
                  <p className="text-sm text-gray-900 font-semibold">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}

              {/* Profile Status */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Profile Status</span>
                </div>
                <p className="text-sm text-gray-900 font-semibold">
                  {user?.profileCompleted ? "✓ Complete" : "Incomplete"}
                </p>
              </div>

              {/* Account Active */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                </div>
                <p className="text-sm font-semibold text-green-600">Active</p>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/profile/setup")}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-900 font-medium transition"
              >
                Edit Profile Picture & Info
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 font-medium transition flex items-center gap-2"
              >
                <MdLogout className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to TogetEase</h3>
          <p className="text-gray-600">
            Your mental wellness journey is important to us. Visit the Community to share your thoughts and connect with others.
          </p>
          <div className="flex gap-4 mt-4 justify-center">
            <button
              onClick={() => navigate("/community")}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium"
            >
              Go to Community
            </button>
            <button
              onClick={() => navigate("/exercises")}
              className="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 font-medium"
            >
              Try Exercises
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
