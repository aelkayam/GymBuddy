import { Router } from "express";
import auth from "../../middleware/auth";
import { check, validationResult } from "express-validator";
import WorkoutExercise from "../../models/workoutExercise.js";

const router = Router();

// @route    POST api/workout-exercises
// @desc     Add exercises to a workout
// @access   Private
router.post(
  "/",
  [
    auth, // Middleware to authenticate the request
    [
      check("workout_id", "Workout ID is required").isInt(),
      check("exercise_id", "Exercise ID is required").isInt(),
      check("sets", "Sets are required").isInt({ min: 1 }),
      check("repetitions", "Repetitions are required").isInt({ min: 1 }),
      check("rest_time", "Rest time is required").isInt({ min: 0 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { workout_id, exercise_id, sets, repetitions, rest_time } = req.body;

    try {
      const newWorkoutExercise = await WorkoutExercise.create({
        workout_id,
        exercise_id,
        sets,
        repetitions,
        rest_time,
      });

      res.json(newWorkoutExercise);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/workout-exercises/workout/:workout_id
// @desc     Get exercises for a specific workout
// @access   Public
router.get("/workout/:workout_id", async (req, res) => {
  try {
    const workoutExercises = await WorkoutExercise.findAll({
      where: { workout_id: req.params.workout_id },
    });
    res.json(workoutExercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/workout-exercises/:id
// @desc     Update a workout exercise by ID
// @access   Private
router.put(
  "/:id",
  [
    auth,
    [
      check("sets", "Sets are required").isInt({ min: 1 }),
      check("repetitions", "Repetitions are required").isInt({ min: 1 }),
      check("rest_time", "Rest time is required").isInt({ min: 0 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sets, repetitions, rest_time } = req.body;

    try {
      let workoutExercise = await WorkoutExercise.findByPk(req.params.id);

      if (!workoutExercise) {
        return res.status(404).json({ msg: "Workout exercise not found" });
      }

      workoutExercise = await workoutExercise.update({
        sets,
        repetitions,
        rest_time,
      });

      res.json(workoutExercise);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/workout-exercises/:id
// @desc     Delete a workout exercise by ID
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const workoutExercise = await WorkoutExercise.findByPk(req.params.id);

    if (!workoutExercise) {
      return res.status(404).json({ msg: "Workout exercise not found" });
    }

    await workoutExercise.destroy();

    res.json({ msg: "Workout exercise removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
