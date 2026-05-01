import { useState, useEffect } from "react";
import API, { logout, getName } from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const name = getName() || "Admin";

  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", status: "Pending", priority: "Medium", userId: "", dueDate: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => { fetchTasks(); fetchUsers(); }, []);

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const res = await API.get("/tasks/admin/all");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await API.get("/admin/users");
      setUsers(res.data.filter((u) => u.role !== "admin"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const openAssign = () => {
    setEditTask(null);
    setForm({ title: "", description: "", status: "Pending", priority: "Medium", userId: "", dueDate: "" });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority || "Medium",
      userId: task.userId?._id || task.userId,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError("Title is required"); return; }
    if (!form.userId) { setFormError("Please select a user"); return; }
    setFormLoading(true);
    setFormError("");
    try {
      if (editTask) {
        await API.put(`/tasks/admin/${editTask._id}`, form);
      } else {
        await API.post("/tasks/admin/assign", form);
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      setFormError(err.response?.data?.error || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/admin/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user and all their tasks?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const statusColor = (s) => ({
    "Pending": "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Completed": "bg-green-100 text-green-700",
  }[s] || "bg-gray-100 text-gray-600");

  const priorityColor = (p) => ({
    "High": "bg-red-100 text-red-600",
    "Medium": "bg-orange-100 text-orange-600",
    "Low": "bg-slate-100 text-slate-600",
  }[p] || "bg-slate-100 text-slate-600");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="text-white font-bold text-sm">TaskFlow</span>
          <span className="text-indigo-400 text-xs ml-1">Admin</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`text-xs px-2 py-1 rounded ${activeTab === "tasks" ? "bg-indigo-600 text-white" : "text-slate-300"}`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`text-xs px-2 py-1 rounded ${activeTab === "users" ? "bg-indigo-600 text-white" : "text-slate-300"}`}
          >
            Users
          </button>
          <button onClick={handleLogout} className="text-xs text-slate-400 px-2 py-1">
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex w-56 h-screen shrink-0 bg-slate-900 border-r border-slate-700 flex-col">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-sm">TaskFlow</span>
              <p className="text-indigo-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === "tasks" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
            All Tasks
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === "users" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m0 0a4 4 0 118 0m-8 0a4 4 0 008 0M12 12a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
            Users
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-600/30 rounded-full flex items-center justify-center text-indigo-400 text-xs font-bold uppercase">
              {name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium truncate">{name}</p>
              <p className="text-indigo-400 text-xs">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="shrink-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3.5 flex justify-between items-center mt-12 md:mt-0">
          <h2 className="text-base font-semibold text-gray-800">
            {activeTab === "tasks" ? "All Tasks" : "Manage Users"}
          </h2>
          {activeTab === "tasks" && (
            <button
              onClick={openAssign}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Assign Task
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {activeTab === "tasks" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                {[
                  { label: "Total Tasks", value: tasks.length, color: "text-indigo-600" },
                  { label: "Pending", value: tasks.filter(t => t.status === "Pending").length, color: "text-yellow-600" },
                  { label: "In Progress", value: tasks.filter(t => t.status === "In Progress").length, color: "text-blue-600" },
                  { label: "Completed", value: tasks.filter(t => t.status === "Completed").length, color: "text-green-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {loadingTasks ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No tasks yet. Assign one!</div>
                ) : (
                  <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Task</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tasks.map((task) => (
                        <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-800">{task.title}</p>
                            {task.description && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{task.description}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-gray-700">{task.userId?.name || "—"}</p>
                            <p className="text-xs text-gray-400">{task.userId?.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor(task.priority)}`}>
                              {task.priority || "Medium"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {task.dueDate ? (() => {
                              const due = new Date(task.dueDate);
                              const today = new Date();
                              today.setHours(0,0,0,0);
                              due.setHours(0,0,0,0);
                              const isOverdue = due < today && task.status !== "Completed";
                              return (
                                <span className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-gray-500"}`}>
                                  {isOverdue && "⚠ "}
                                  {due.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                              );
                            })() : <span className="text-xs text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => openEdit(task)} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded hover:bg-blue-100 transition-colors">Edit</button>
                              <button onClick={() => handleDeleteTask(task._id)} className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded hover:bg-red-100 transition-colors">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "users" && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {loadingUsers ? (
                <div className="p-8 text-center text-gray-400 text-sm">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No users registered yet.</div>
              ) : (
                <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tasks</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => {
                      const userTaskCount = tasks.filter(t => (t.userId?._id || t.userId) === user._id).length;
                      return (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold uppercase">
                                {user.name?.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-800">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{user.email}</td>
                          <td className="px-4 py-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full">{userTaskCount} tasks</span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDeleteUser(user._id)} className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded hover:bg-red-100 transition-colors">Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-gray-800">
                {editTask ? "Edit Task" : "Assign Task"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {formError && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Assign to User</label>
                <select
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a user...</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Task title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  placeholder="Optional description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving...
                    </>
                  ) : editTask ? "Update Task" : "Assign Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
