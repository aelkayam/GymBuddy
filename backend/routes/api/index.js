import express from "express";
import usersRouter from "./users.js";
import authRouter from "./auth.js";
import workoutsRouter from "./workout.js";
import exercisesRouter from "./exercises.js";
import progressRouter from "./progress.js";
import goalsRouter from "./goals.js";
import messagesRouter from "./message.js";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/auth", authRouter);
router.use("/workouts", workoutsRouter);
router.use("/exercises", exercisesRouter);
router.use("/workout-exercises", exercisesRouter);
router.use("/progress", progressRouter);
router.use("/goals", goalsRouter);
router.use("/messages", messagesRouter);

export default router;
