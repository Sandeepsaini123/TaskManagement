import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      const tasks = res.data;

      setStats({
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "Pending").length,
        inProgress: tasks.filter((t) => t.status === "In Progress").length,
        completed: tasks.filter((t) => t.status === "Completed").length,
      });

      // Show 5 most recent tasks
      setRecentTasks(tasks.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s) =>
    ({
      Pending: "bg-yellow-100 text-yellow-700",
      "In Progress": "bg-blue-100 text-blue-700",
      Completed: "bg-green-100 text-green-700",
    }[s] || "bg-gray-100 text-gray-600");

  const priorityColor = (p) =>
    ({
      High: "bg-red-100 text-red-600",
      Medium: "bg-orange-100 text-orange-600",
      Low: "bg-slate-100 text-slate-500",
    }[p] || "bg-slate-100 text-slate-500");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="shrink-0">
          <Navbar title="Dashboard" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Total Tasks
                    </p>
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Pending
                    </p>
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      In Progress
                    </p>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Completed
                    </p>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-700">Recent Tasks</h2>
                  <Link
                    to="/my-tasks"
                    className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    View all →
                  </Link>
                </div>

                {recentTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    <svg
                      className="w-10 h-10 mx-auto mb-3 opacity-40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p>No tasks yet. Create one from My Tasks!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentTasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority || "Medium"}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
