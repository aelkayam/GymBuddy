// routes/api/goals.js

import { Router } from "express";
import { check, validationResult } from "express-validator";
import auth from "../../middleware/auth";
import Goal from "../../models/goal";

const router = Router();

// @route    POST api/goals
// @desc     Create a goal
// @access   Private
router.post(
  "/",
  [
    auth, // Middleware to authenticate user
    check("type_of_goal", "Type of goal is required").not().isEmpty(),
    check("user_id", "User ID is required").not().isEmpty(),
    check("user_id", "User ID must be a number").isInt(),
    check("type_of_goal", "Invalid type of goal").isIn(["weight", "strength"]),
    check("target_weight", "Target weight must be a number")
      .optional()
      .isFloat(),
    check(
      "target_strength_exercise_id",
      "Target strength exercise ID must be a number"
    )
      .optional()
      .isInt(),
    check("target_strength_value", "Target strength value must be a number")
      .optional()
      .isFloat(),
    check("target_date", "Invalid target date").optional().isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      user_id,
      type_of_goal,
      target_weight,
      target_strength_exercise_id,
      target_strength_value,
      target_date,
    } = req.body;

    try {
      const newGoal = await Goal.create({
        user_id,
        type_of_goal,
        target_weight,
        target_strength_exercise_id,
        target_strength_value,
        target_date,
      });

      res.json(newGoal);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/goals/:id
// @desc     Get goal by ID
// @access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const goal = await Goal.findByPk(req.params.id);

    if (!goal) {
      return res.status(404).json({ msg: "Goal not found" });
    }

    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/goals/user/:user_id
// @desc     Get all goals of a user
// @access   Private
router.get("/user/:user_id", auth, async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: {
        user_id: req.params.user_id,
      },
    });

    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/goals/:id
// @desc     Update a goal
// @access   Private
router.put(
  "/:id",
  [
    auth,
    check("type_of_goal", "Type of goal is required").not().isEmpty(),
    check("user_id", "User ID is required").not().isEmpty(),
    check("user_id", "User ID must be a number").isInt(),
    check("type_of_goal", "Invalid type of goal").isIn(["weight", "strength"]),
    check("target_weight", "Target weight must be a number")
      .optional()
      .isFloat(),
    check(
      "target_strength_exercise_id",
      "Target strength exercise ID must be a number"
    )
      .optional()
      .isInt(),
    check("target_strength_value", "Target strength value must be a number")
      .optional()
      .isFloat(),
    check("target_date", "Invalid target date").optional().isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      type_of_goal,
      user_id,
      target_weight,
      target_strength_exercise_id,
      target_strength_value,
      target_date,
    } = req.body;

    try {
      let goal = await Goal.findByPk(req.params.id);

      if (!goal) {
        return res.status(404).json({ msg: "Goal not found" });
      }

      goal.type_of_goal = type_of_goal;
      goal.user_id = user_id;
      goal.target_weight = target_weight;
      goal.target_strength_exercise_id = target_strength_exercise_id;
      goal.target_strength_value = target_strength_value;
      goal.target_date = target_date;

      await goal.save();

      res.json(goal);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/goals/:id
// @desc     Delete a goal
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const goal = await Goal.findByPk(req.params.id);

    if (!goal) {
      return res.status(404).json({ msg: "Goal not found" });
    }

    await goal.destroy();

    res.json({ msg: "Goal removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
