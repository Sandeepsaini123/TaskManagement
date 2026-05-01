import { useEffect, useState } from "react";
import API from "../services/api";

const statusColor = (s) => ({
  "Pending": "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Completed": "bg-green-100 text-green-700",
}[s] || "bg-gray-100 text-gray-600");

const priorityColor = (p) => ({
  "High": "bg-red-100 text-red-600",
  "Medium": "bg-orange-100 text-orange-600",
  "Low": "bg-slate-100 text-slate-500",
}[p] || "bg-slate-100 text-slate-500");

const formatDueDate = (dateStr) => {
  if (!dateStr) return null;
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  const label = due.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (diffDays < 0) return { label, style: "bg-red-100 text-red-600", tag: "Overdue" };
  if (diffDays === 0) return { label, style: "bg-orange-100 text-orange-600", tag: "Due today" };
  if (diffDays <= 2) return { label, style: "bg-yellow-100 text-yellow-700", tag: `${diffDays}d left` };
  return { label, style: "bg-slate-100 text-slate-500", tag: null };
};

function TaskList({ setSelectedTask, refreshKey }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, [refreshKey]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete task");
    }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading tasks...</p>;

  if (tasks.length === 0)
    return (
      <div className="text-center py-12 text-gray-400">
        <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm">No tasks yet. Add one above!</p>
      </div>
    );

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Your Tasks ({tasks.length})</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex justify-between items-start hover:shadow-sm transition-shadow">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm">{task.title}</p>
              {task.description && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{task.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor(task.priority)}`}>
                  {task.priority || "Medium"}
                </span>
                {(() => {
                  const due = formatDueDate(task.dueDate);
                  if (!due) return null;
                  return (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${due.style}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {due.tag ? `${due.tag} · ${due.label}` : due.label}
                    </span>
                  );
                })()}
                {task.assignedBy && task.assignedBy?._id?.toString() !== task.userId?.toString() && (
                  <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Assigned by Admin
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-4 shrink-0">
              <button
                onClick={() => setSelectedTask(task)}
                className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded hover:bg-blue-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
