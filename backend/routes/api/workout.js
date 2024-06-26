import { Router } from "express";
import auth from "../../middleware/auth.js";
import { check, validationResult } from "express-validator";
import Workout from "../../models/workout.js";

const router = Router();

// @route    POST api/workouts
// @desc     Create a new workout
// @access   Private
router.post(
  "/",
  [
    auth, // Middleware to authenticate the request
    [
      check("title", "Title is required").not().isEmpty(),
      check("duration", "Duration is required").not().isEmpty(),
      check("difficulty", "Difficulty is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, images, duration, difficulty } = req.body;

    try {
      const newWorkout = await Workout.create({
        user_id: req.user.id, // Assuming you have user information in req.user after authentication
        title,
        description,
        images,
        duration,
        difficulty,
      });

      res.json(newWorkout);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/workouts
// @desc     Get all workouts
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const workouts = await Workout.findAll({
      where: { user_id: req.user.id }, // Fetch workouts specific to the logged-in user
      include: [{ model: User, as: "trainer", attributes: ["id", "username"] }], // Assuming you associate trainers with workouts
    });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/workouts/:id
// @desc     Get a single workout by ID
// @access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      where: { id: req.params.id, user_id: req.user.id }, // Find workout by ID and user ID
    });

    if (!workout) {
      return res.status(404).json({ msg: "Workout not found" });
    }

    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/workouts/:id
// @desc     Update a workout by ID
// @access   Private
router.put(
  "/:id",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("duration", "Duration is required").not().isEmpty(),
      check("difficulty", "Difficulty is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, images, duration, difficulty } = req.body;

    try {
      let workout = await Workout.findByPk(req.params.id);

      if (!workout) {
        return res.status(404).json({ msg: "Workout not found" });
      }

      // Ensure the user owns the workout
      if (workout.user_id !== req.user.id) {
        return res.status(401).json({ msg: "Not authorized" });
      }

      workout = await workout.update({
        title,
        description,
        images,
        duration,
        difficulty,
      });

      res.json(workout);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/workouts/:id
// @desc     Delete a workout by ID
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const workout = await Workout.findByPk(req.params.id);

    if (!workout) {
      return res.status(404).json({ msg: "Workout not found" });
    }

    // Ensure the user owns the workout
    if (workout.user_id !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await workout.destroy();

    res.json({ msg: "Workout removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
