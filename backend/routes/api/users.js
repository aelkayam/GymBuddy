import { Router } from "express";
import { check, validationResult } from "express-validator";
import auth from "../../middleware/auth";
import User from "../../models/user.js";

const router = Router();

// @route    GET api/users
// @desc     Get all users
// @access   Private (example: admin only)
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Exclude password from query
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/users/:id
// @desc     Get user by ID
// @access   Private (example: admin only)
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] }, // Exclude password from query
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/users/:id
// @desc     Update user by ID
// @access   Private (example: admin only)
router.put(
  "/:id",
  [
    auth,
    [
      check("username", "Username is required").not().isEmpty(),
      check("email", "Please include a valid email").isEmail(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, weight, height, age, goal } = req.body;

    // Build updated user object
    const userFields = {};
    if (username) userFields.username = username;
    if (email) userFields.email = email;
    if (weight) userFields.weight = weight;
    if (height) userFields.height = height;
    if (age) userFields.age = age;
    if (goal) userFields.goal = goal;

    try {
      let user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Update user in database
      user = await user.update(userFields);

      // Return updated user
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/users/:id
// @desc     Delete user by ID
// @access   Private (example: admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.destroy();

    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
