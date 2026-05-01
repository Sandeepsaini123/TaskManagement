const User = require("../models/User");
const Task = require("../models/Task");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role === "admin")
      return res.status(403).json({ error: "Cannot delete admin" });

    await Task.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({ message: "User and their tasks deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
