// Import express to begin using it
const express = require("express");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

// Import routes
const userRoutes = require("./routes/userRoutes"); 
const watchRoutes = require("./routes/watchRoutes");
const brandRoutes = require("./routes/brandRoutes");

// Make an instance of an express server
const app = express();

// Add middleware to parse JSON request bodies
app.use(express.json());

// Mount API routes
app.use("/api/users", userRoutes); 
app.use("/api/watches", watchRoutes);
app.use("/api/brands", brandRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({
    message: "Hello, world!"
  });
});

// Error handler middleware (should be after all routes)
app.use(errorHandler);

// Server startup is handled in index.js
module.exports = { app };