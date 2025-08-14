const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // <-- this must be at the top

const app = express();

// Use the env variable
const mongoUri = process.env.MONGO_URI;
console.log("DEBUG MONGO_URI:", mongoUri); // Optional: check if it's loaded

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

