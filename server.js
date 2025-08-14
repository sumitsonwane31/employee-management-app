// server.js
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// DB connect
console.log("DEBUG MONGO_URI:", process.env.MONGO_URL);
connectDB(process.env.MONGO_URI);


// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static frontend (for quick testing)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/employees", require("./routes/employeeRoutes"));

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});


app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
