// seed.js - seed the database with two sample polls
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Poll = require("./models/poll");

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/livepoll";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB for seeding");

  await Poll.deleteMany({});

  const polls = [
    {
      question: "Favorite frontend library?",
      options: [
        { text: "React", votes: 5 },
        { text: "Vue", votes: 2 },
        { text: "Angular", votes: 1 },
      ],
    },
    {
      question: "Preferred backend language?",
      options: [
        { text: "Node.js", votes: 4 },
        { text: "Python", votes: 3 },
        { text: "Go", votes: 1 },
      ],
    },
  ];

  await Poll.insertMany(polls);
  console.log("Seeding complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
