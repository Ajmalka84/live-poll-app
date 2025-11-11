// routes/polls.js
const express = require("express");
const router = express.Router();
const Poll = require("../models/poll");

// GET /api/polls - list all polls
router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 }).lean();
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/polls/:id - single poll
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).lean();
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid poll id" });
  }
});

// POST /api/polls/:pollId/options/:optionId/vote - cast vote
router.post("/:pollId/options/:optionId/vote", async (req, res) => {
  const { pollId, optionId } = req.params;
  try {
    const updated = await Poll.findOneAndUpdate(
      { _id: pollId, "options._id": optionId },
      { $inc: { "options.$.votes": 1 } },
      { new: true }
    ).lean();

    if (!updated)
      return res.status(404).json({ error: "Poll or option not found" });

    const option = updated.options.find(
      (o) => String(o._id) === String(optionId)
    );
    res.json({ poll: updated, option });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid request" });
  }
});

// POST /api/polls - create poll (optional for Phase 1 but useful for testing)
router.post("/", async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || !Array.isArray(options) || options.length < 2) {
      return res
        .status(400)
        .json({ error: "Question and at least two options required" });
    }
    const poll = new Poll({
      question,
      options: options.map((text) => ({ text })),
    });
    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
