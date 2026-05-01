import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { useState } from "react";

function MyTasks() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshTasks = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="shrink-0">
          <Navbar title="My Tasks" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <TaskForm
            selectedTask={selectedTask}
            refreshTasks={refreshTasks}
            clearSelection={() => setSelectedTask(null)}
          />
          <TaskList
            setSelectedTask={setSelectedTask}
            refreshKey={refreshKey}
          />
        </div>
      </div>
    </div>
  );
}

export default MyTasks;
