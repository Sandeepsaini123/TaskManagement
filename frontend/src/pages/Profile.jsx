import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", role: "" });
  const [nameForm, setNameForm] = useState("");
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const [nameLoading, setNameLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState({ type: "", text: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      setProfile(res.data);
      setNameForm(res.data.name);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!nameForm.trim()) return;
    setNameLoading(true);
    setNameMsg({ type: "", text: "" });
    try {
      const res = await API.put("/profile", { name: nameForm });
      setProfile((prev) => ({ ...prev, name: res.data.user.name }));
      // Update localStorage so Navbar reflects immediately
      localStorage.setItem("name", res.data.user.name);
      setNameMsg({ type: "success", text: "Name updated successfully." });
    } catch (err) {
      setNameMsg({ type: "error", text: err.response?.data?.error || "Failed to update name." });
    } finally {
      setNameLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPwMsg({ type: "", text: "" });

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setPwLoading(true);
    try {
      await API.put("/profile", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwMsg({ type: "success", text: "Password updated successfully." });
    } catch (err) {
      setPwMsg({ type: "error", text: err.response?.data?.error || "Failed to update password." });
    } finally {
      setPwLoading(false);
    }
  };

  const msgClass = (type) =>
    type === "success"
      ? "text-green-700 bg-green-50 border border-green-200"
      : "text-red-600 bg-red-50 border border-red-200";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="shrink-0">
          <Navbar title="Profile" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-5">

              {/* Account Info Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold uppercase shrink-0">
                    {profile.name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-800">{profile.name}</h2>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                    <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium capitalize">
                      {profile.role}
                    </span>
                  </div>
                </div>

                {/* Update Name */}
                <form onSubmit={handleUpdateName} className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 border-t border-gray-100 pt-4">
                    Update Name
                  </h3>
                  {nameMsg.text && (
                    <div className={`text-sm px-3 py-2 rounded-lg ${msgClass(nameMsg.type)}`}>
                      {nameMsg.text}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={nameForm}
                      onChange={(e) => setNameForm(e.target.value)}
                      placeholder="Your full name"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={nameLoading || nameForm.trim() === profile.name}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shrink-0"
                    >
                      {nameLoading ? (
                        <>
                          <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Saving...
                        </>
                      ) : "Save"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">Email cannot be changed.</p>
                </form>
              </div>

              {/* Change Password Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Change Password</h3>

                {pwMsg.text && (
                  <div className={`text-sm px-3 py-2 rounded-lg mb-4 ${msgClass(pwMsg.type)}`}>
                    {pwMsg.text}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={pwForm.currentPassword}
                      required
                      onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Min. 6 characters"
                        value={pwForm.newPassword}
                        required
                        onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Re-enter new password"
                        value={pwForm.confirmPassword}
                        required
                        onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {pwLoading ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Updating...
                      </>
                    ) : "Update Password"}
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
