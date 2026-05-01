const express = require("express");
const auth = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/profileController");

const router = express.Router();

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);

module.exports = router;
