const express = require("express");
const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  adminGetAllTasks,
  adminAssignTask,
  adminUpdateTask,
  adminDeleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", auth, getTasks);
router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

router.get("/admin/all", auth, requireRole("admin"), adminGetAllTasks);
router.post("/admin/assign", auth, requireRole("admin"), adminAssignTask);
router.put("/admin/:id", auth, requireRole("admin"), adminUpdateTask);
router.delete("/admin/:id", auth, requireRole("admin"), adminDeleteTask);

module.exports = router;
