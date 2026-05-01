import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User routes */}
        <Route path="/dashboard" element={<PrivateRoute role="user"><Dashboard /></PrivateRoute>} />
        <Route path="/my-tasks" element={<PrivateRoute role="user"><MyTasks /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute role="user"><Profile /></PrivateRoute>} />

        {/* Admin dashboard */}
        <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
