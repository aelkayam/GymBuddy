import { Router } from "express";
import { validationResult } from "express-validator";
import auth from "../../middleware/auth.js";
import Message from "../../models/message.js";

const router = Router();

// @route    GET api/messages
// @desc     Get all messages (example)
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        receiver_id: req.user.id, // Example: Fetch messages for the authenticated user
      },
      include: [
        { model: User, as: "sender" },
        { model: User, as: "receiver" },
      ], // Adjust associations as per your actual model
    });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/messages
// @desc     Send a message
// @access   Private
router.post(
  "/",
  [
    auth,
    // Add validation if necessary
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiver_id, message_text } = req.body;

    try {
      // Create new message
      const newMessage = await Message.create({
        sender_id: req.user.id,
        receiver_id,
        message_text,
      });

      res.json(newMessage);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

export default router;
