import { Router } from "express";
import auth from "../../middleware/auth.js";
import { check, validationResult } from "express-validator";
import Exercise from "../../models/exercise.js";

const router = Router();

// @route    POST api/exercises
// @desc     Create a new exercise
// @access   Private
router.post(
  "/",
  [
    auth, // Middleware to authenticate the request
    [
      check("name", "Name is required").not().isEmpty(),
      check("muscle_groups", "Muscle groups are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, muscle_groups, description } = req.body;

    try {
      const newExercise = await Exercise.create({
        name,
        muscle_groups,
        description,
      });

      res.json(newExercise);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/exercises
// @desc     Get all exercises
// @access   Public
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.findAll();
    res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/exercises/:id
// @desc     Get a single exercise by ID
// @access   Public
router.get("/:id", async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);

    if (!exercise) {
      return res.status(404).json({ msg: "Exercise not found" });
    }

    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/exercises/:id
// @desc     Update an exercise by ID
// @access   Private
router.put(
  "/:id",
  [
    auth,
    [
      check("name", "Name is required").not().isEmpty(),
      check("muscle_groups", "Muscle groups are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, muscle_groups, description } = req.body;

    try {
      let exercise = await Exercise.findByPk(req.params.id);

      if (!exercise) {
        return res.status(404).json({ msg: "Exercise not found" });
      }

      exercise = await exercise.update({
        name,
        muscle_groups,
        description,
      });

      res.json(exercise);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/exercises/:id
// @desc     Delete an exercise by ID
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);

    if (!exercise) {
      return res.status(404).json({ msg: "Exercise not found" });
    }

    await exercise.destroy();

    res.json({ msg: "Exercise removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
