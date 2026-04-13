import React, { useContext, useState, useEffect } from "react";
import { MdEdit, MdLogout } from "react-icons/md";
import { AuthContext } from "../components/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Mail, Calendar, Award, Brain, Wind, Heart, Moon, ChevronDown, ChevronUp } from "lucide-react";
import BASE_URL from "../config";

/* ─────────────────────────────────────────────
   SURVEY META — colors, icons, score ranges
───────────────────────────────────────────── */
const SURVEY_META = {
  "PHQ-9": {
    label: "Depression (PHQ-9)",
    icon: <Brain className="w-5 h-5" />,
    color: "indigo",
    maxScore: 27,
    description: "Measures depression symptoms over the last 2 weeks.",
  },
  "GAD-7": {
    label: "Anxiety (GAD-7)",
    icon: <Wind className="w-5 h-5" />,
    color: "violet",
    maxScore: 21,
    description: "Measures generalized anxiety disorder symptoms.",
  },
  "WHO-5": {
    label: "Well-being (WHO-5)",
    icon: <Heart className="w-5 h-5" />,
    color: "emerald",
    maxScore: 25,
    description: "Measures overall mental well-being.",
  },
};

const SEVERITY_COLOR = {
  "Minimal": "bg-emerald-100 text-emerald-700",
  "Mild": "bg-yellow-100  text-yellow-700",
  "Moderate": "bg-orange-100  text-orange-700",
  "Moderately Severe": "bg-red-100     text-red-700",
  "Severe": "bg-red-200     text-red-800",
  "Low Well-being": "bg-orange-100  text-orange-700",
  "Normal Well-being": "bg-emerald-100 text-emerald-700",
};

const COLOR_MAP = {
  indigo: { bar: "bg-indigo-500", track: "bg-indigo-100", card: "bg-indigo-50", icon: "text-indigo-500", border: "border-indigo-200" },
  violet: { bar: "bg-violet-500", track: "bg-violet-100", card: "bg-violet-50", icon: "text-violet-500", border: "border-violet-200" },
  emerald: { bar: "bg-emerald-500", track: "bg-emerald-100", card: "bg-emerald-50", icon: "text-emerald-500", border: "border-emerald-200" },
};

/* ─────────────────────────────────────────────
   SCORE BAR
───────────────────────────────────────────── */
function ScoreBar({ score, maxScore, color }) {
  const pct = Math.round((score / maxScore) * 100);
  const c = COLOR_MAP[color];
  return (
    <div className="flex items-center gap-3 mt-2">
      <div className={`flex-1 h-2 rounded-full ${c.track}`}>
        <div
          className={`h-2 rounded-full ${c.bar} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-14 text-right">
        {score} / {maxScore}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LATEST RESULT CARD
───────────────────────────────────────────── */
function LatestCard({ surveyType, result }) {
  const meta = SURVEY_META[surveyType];
  const c = COLOR_MAP[meta.color];

  if (!result) {
    return (
      <div className={`rounded-2xl border ${c.border} ${c.card} p-5 flex flex-col gap-2 opacity-60`}>
        <div className={`flex items-center gap-2 ${c.icon} font-semibold text-sm`}>
          {meta.icon} {meta.label}
        </div>
        <p className="text-xs text-gray-400">Not taken yet</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${c.border} ${c.card} p-5 flex flex-col gap-1`}>
      <div className={`flex items-center gap-2 ${c.icon} font-semibold text-sm mb-1`}>
        {meta.icon} {meta.label}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">{result.totalScore}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${SEVERITY_COLOR[result.severity] ?? "bg-gray-100 text-gray-600"}`}>
          {result.severity}
        </span>
      </div>
      <ScoreBar score={result.totalScore} maxScore={meta.maxScore} color={meta.color} />
      <p className="text-xs text-gray-400 mt-1">
        {new Date(result.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HISTORY TIMELINE
───────────────────────────────────────────── */
function HistoryTimeline({ surveys }) {
  const [expanded, setExpanded] = useState(false);
  // Show only the most recent 3 surveys, with option to expand to show more
  const recentSurveys = surveys.slice(0, 3);
  const visible = expanded ? surveys : recentSurveys;

  if (surveys.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-4">No survey history yet.</p>;
  }

  return (
    <div>
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />

        <div className="space-y-4">
          {visible.map((s, i) => {
            const meta = SURVEY_META[s.surveyType];
            const c = COLOR_MAP[meta?.color ?? "indigo"];
            return (
              <div key={s._id ?? i} className="relative flex items-start gap-3">
                {/* Dot */}
                <div className={`absolute -left-4 mt-1 w-3 h-3 rounded-full border-2 border-white ${c.bar}`} />

                <div className={`flex-1 rounded-xl border ${c.border} ${c.card} px-4 py-3`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className={`flex items-center gap-1.5 text-sm font-semibold ${c.icon}`}>
                      {meta?.icon} {meta?.label ?? s.surveyType}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SEVERITY_COLOR[s.severity] ?? "bg-gray-100 text-gray-600"}`}>
                      {s.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-bold text-gray-900">
                      {s.totalScore}
                      <span className="text-xs text-gray-400 font-normal ml-1">
                        / {meta?.maxScore}
                      </span>
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show more / less toggle */}
      {surveys.length > 3 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-4 w-full flex items-center justify-center gap-1 text-sm text-indigo-500 hover:text-indigo-700 transition"
        >
          {expanded
            ? <><ChevronUp className="w-4 h-4" /> Show less</>
            : <><ChevronDown className="w-4 h-4" /> Show {surveys.length - 3} more</>}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SURVEY RESULTS SECTION  (fetches own data)
───────────────────────────────────────────── */
function SurveyResults() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  useEffect(() => {
    fetch(`${BASE_URL}/api/survey`, { credentials: "include", cache: "no-store" })
      .then(r => r.json())
      .then(data => setSurveys(data.data ?? []))
      .catch(() => setSurveys([]))
      .finally(() => setLoading(false));
  }, [location.key]);

  // Latest result per survey type
  const latest = {};
  for (const type of ["PHQ-9", "GAD-7", "WHO-5"]) {
    latest[type] = surveys
      .filter(s => s.surveyType === type)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] ?? null;
  }

  // Full history newest first
  const history = [...surveys].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Results</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Survey Results</h3>
      <p className="text-sm text-gray-400 mb-4">Your latest scores across all three assessments.</p>

      {/* Latest cards — 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {["PHQ-9", "GAD-7", "WHO-5"].map(type => (
          <LatestCard key={type} surveyType={type} result={latest[type]} />
        ))}
      </div>

      {/* History timeline */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3">History</h4>
      <HistoryTimeline surveys={history} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROFILE PAGE
───────────────────────────────────────────── */
const Profile = () => {
  const { selectedAvatar, username, user, isAuthenticated, handleLogOut, setUsername } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(username);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const handleEditUsername = async () => {
    if (!editUsername.trim()) { toast.error("Username cannot be empty"); return; }
    if (editUsername === username) { setIsEditing(false); return; }

    try {
      const response = await fetch(`${BASE_URL}/api/profile/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: editUsername }),
      });

      if (response.ok) {
        setUsername(editUsername);
        toast.success("Username updated successfully");
        setIsEditing(false);
      } else {
        toast.error("Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("Failed to update username");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Main profile card ── */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="rounded-full overflow-hidden w-[120px] h-[120px] border-4 border-purple-600 shadow-lg mb-4">
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
              <MdEdit className="w-4 h-4" /> Change Avatar
            </button>
          </div>

          {/* Username */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-purple-600" />
              <span className="text-gray-600 text-sm font-medium">Username</span>
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
                <button onClick={handleEditUsername} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium">Save</button>
                <button onClick={() => { setIsEditing(false); setEditUsername(username); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{username}</h2>
                <button onClick={() => setIsEditing(true)} className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition">
                  <MdEdit className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          {user?.email && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600 text-sm font-medium">Email</span>
              </div>
              <p className="text-lg text-gray-900 ml-8">{user.email}</p>
            </div>
          )}

          {/* Account stats */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {user?.createdAt && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Member Since</span>
                  </div>
                  <p className="text-sm text-gray-900 font-semibold">
                    {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
              )}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Profile Status</span>
                </div>
                <p className="text-sm text-gray-900 font-semibold">
                  {user?.profileCompleted ? "✓ Complete" : "Incomplete"}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                </div>
                <p className="text-sm font-semibold text-green-600">Active</p>
              </div>
            </div>
          </div>

          {/* ── Survey Results ── */}
          <SurveyResults />

          {/* Account settings */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/profile/setup")}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-900 font-medium transition"
              >
                Edit Profile Picture & Info
              </button>
              <button
                onClick={() => { handleLogOut(); navigate("/login"); }}
                className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 font-medium transition flex items-center gap-2"
              >
                <MdLogout className="w-5 h-5" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA card */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to TogetEase</h3>
          <p className="text-gray-500 text-sm">
            Your mental wellness journey is important to us. Visit the Community to share your thoughts and connect with others.
          </p>
          <div className="flex gap-4 mt-4 justify-center">
            <button onClick={() => navigate("/community")} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium text-sm">
              Go to Community
            </button>
            <button onClick={() => navigate("/exercises")} className="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 font-medium text-sm">
              Try Exercises
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;