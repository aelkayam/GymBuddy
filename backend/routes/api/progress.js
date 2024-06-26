import { Router } from "express";
import auth from "../../middleware/auth.js";
import { check, validationResult } from "express-validator";
import Progress from "../../models/progress.js";

const router = Router();

// @route    POST api/progress
// @desc     Add progress for a workout
// @access   Private
router.post(
  "/",
  [
    auth, // Middleware to authenticate the request
    [
      check("user_id", "User ID is required").isInt(),
      check("workout_id", "Workout ID is required").isInt(),
      check("progress_date", "Progress date is required").isISO8601().toDate(),
      check("status", "Status is required").isIn(["completed", "missed"]),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, workout_id, progress_date, status, notes } = req.body;

    try {
      const newProgress = await Progress.create({
        user_id,
        workout_id,
        progress_date,
        status,
        notes,
      });

      res.json(newProgress);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/progress/user/:user_id
// @desc     Get progress for a specific user
// @access   Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const userProgress = await Progress.findAll({
      where: { user_id: req.params.user_id },
    });
    res.json(userProgress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/progress/workout/:workout_id
// @desc     Get progress for a specific workout
// @access   Public
router.get("/workout/:workout_id", async (req, res) => {
  try {
    const workoutProgress = await Progress.findAll({
      where: { workout_id: req.params.workout_id },
    });
    res.json(workoutProgress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/progress/:id
// @desc     Update progress by ID
// @access   Private
router.put(
  "/:id",
  [
    auth,
    [
      check("progress_date", "Progress date is required").isISO8601().toDate(),
      check("status", "Status is required").isIn(["completed", "missed"]),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { progress_date, status, notes } = req.body;

    try {
      let progress = await Progress.findByPk(req.params.id);

      if (!progress) {
        return res.status(404).json({ msg: "Progress not found" });
      }

      progress = await progress.update({
        progress_date,
        status,
        notes,
      });

      res.json(progress);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/progress/:id
// @desc     Delete progress by ID
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const progress = await Progress.findByPk(req.params.id);

    if (!progress) {
      return res.status(404).json({ msg: "Progress not found" });
    }

    await progress.destroy();

    res.json({ msg: "Progress removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
