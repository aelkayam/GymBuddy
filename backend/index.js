import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js"; // Explicitly import index.js
import authRoutes from "./routes/api/auth.js";

import usersRouter from "./routes/api/users.js";
import authRouter from "./routes/api/auth.js";
import workoutsRouter from "./routes/api/workout.js";
import exercisesRouter from "./routes/api/exercises.js";
import progressRouter from "./routes/api/progress.js";
import goalsRouter from "./routes/api/goals.js";
import messagesRouter from "./routes/api/message.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", authRoutes); // Use imported routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/workouts", workoutsRouter);
app.use("/exercises", exercisesRouter);
app.use("/workout-exercises", exercisesRouter);
app.use("/progress", progressRouter);
app.use("/goals", goalsRouter);
app.use("/messages", messagesRouter);

// Welcome route
app.get("/", (req, res) => {
  res.send("Hello, GymBuddy!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!", err);
});

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
