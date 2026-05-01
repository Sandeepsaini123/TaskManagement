const express = require("express");
const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { getAllUsers, deleteUser } = require("../controllers/adminController");

const router = express.Router();

router.get("/users", auth, requireRole("admin"), getAllUsers);
router.delete("/users/:id", auth, requireRole("admin"), deleteUser);

module.exports = router;
