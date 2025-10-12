import React, { useState } from "react";

const ProfileGeneration = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("/boy.png");
  const [username, setUsername] = useState("");
  const [generatedUsernames, setGeneratedUsernames] = useState([]);

  // Available avatars
  const avatars = [
    "/boy.png",
    "/girl.png",
    "/avatar1.png",
    "/avatar2.png",
    "/avatar3.png",
    "/avatar4.png",
  ];

  // Username generation arrays
  const adjectives = [
    "Swift", "Brave", "Clever", "Mighty", "Silent", "Golden", "Shadow", "Cosmic",
    "Thunder", "Crystal", "Phoenix", "Dragon", "Tiger", "Ninja", "Storm", "Ice"
  ];

  const nouns = [
    "Warrior", "Hunter", "Knight", "Master", "Legend", "Hero", "Champion", "Guardian",
    "Wizard", "Samurai", "Ranger", "Assassin", "Phantom", "Wolf", "Eagle", "Fox"
  ];

  // Generate random usernames
  const generateUsernames = () => {
    const usernames = [];
    for (let i = 0; i < 5; i++) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const num = Math.floor(Math.random() * 999);
      usernames.push(`${adj}${noun}${num}`);
    }
    setGeneratedUsernames(usernames);
  };

  // Handle save
  const handleSave = () => {
    if (!username) {
      alert("Please select a username!");
      return;
    }

    // Save to backend or context
    console.log("Saving profile:", { avatar: selectedAvatar, username });
    
    alert("Profile saved successfully!");
    setShowDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Create Your Profile
        </h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative w-32 h-32 rounded-full shadow-xl border-4 border-purple-200 cursor-pointer group overflow-hidden"
            onClick={() => setShowDialog(true)}
          >
            <img
              src={selectedAvatar}
              alt="profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <svg className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-sm">Click to change avatar</p>
        </div>

        {/* Username Display */}
        <div className="text-center mb-6">
          {username ? (
            <>
              <p className="text-gray-600 text-sm mb-2">Your Username</p>
              <p className="text-2xl font-bold text-purple-600">{username}</p>
            </>
          ) : (
            <p className="text-gray-400">No username selected</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowDialog(true)}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Setup Profile
          </button>
          {username && (
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Save Profile
            </button>
          )}
        </div>
      </div>

      {/* Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Customize Your Profile
              </h2>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Avatar Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Choose Your Avatar
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {avatars.map((avatar, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative w-20 h-20 rounded-full cursor-pointer border-4 transition-all ${
                        selectedAvatar === avatar
                          ? "border-purple-600 scale-110"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <img
                        src={avatar}
                        alt={`avatar-${index}`}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.src = "/boy.png";
                        }}
                      />
                      {selectedAvatar === avatar && (
                        <div className="absolute -top-1 -right-1 bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Username Generator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Choose Your Username
                  </h3>
                  <button
                    onClick={generateUsernames}
                    className="flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Generate
                  </button>
                </div>

                {generatedUsernames.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-400 mb-2">
                      Click "Generate" to get username suggestions
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {generatedUsernames.map((name, index) => (
                      <button
                        key={index}
                        onClick={() => setUsername(name)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          username === name
                            ? "border-purple-600 bg-purple-50 text-purple-700 font-semibold"
                            : "border-gray-200 hover:border-purple-300 bg-white"
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Username Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter your own username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter custom username..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

              {/* Save Button */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!username}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    username
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileGeneration;