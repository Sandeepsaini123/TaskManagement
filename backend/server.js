require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/tasks", require("./src/routes/taskRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/profile", require("./src/routes/profileRoutes"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
