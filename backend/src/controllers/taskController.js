const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).populate("assignedBy", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.id,
      assignedBy: req.user.id,
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await task.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminGetAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("userId", "name email")
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminAssignTask = async (req, res) => {
  try {
    const { title, description, status, priority, userId, dueDate } = req.body;

    if (!userId) return res.status(400).json({ error: "userId is required" });

    const task = await Task.create({
      title,
      description,
      status: status || "Pending",
      priority: priority || "Medium",
      dueDate: dueDate || null,
      userId,
      assignedBy: req.user.id,
    });

    const populated = await task.populate("userId", "name email");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminUpdateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    Object.assign(task, req.body);
    await task.save();

    const populated = await task.populate("userId", "name email");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.adminDeleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
