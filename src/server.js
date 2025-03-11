// import express to begin using it
const express = require("express");

// import middleware
const errorHandler = require('./middleware/errorHandler');

// make an instance of an express server
const app = express();

// Add middleware to parse JSON request bodies
app.use(express.json());

// configure the server instance with its routes and other middleware
app.get("/", (request, response) => {
  response.json({
    message: "Hello, world!"
  });
});

// Error handler middleware (after all routes)
app.use(errorHandler);

// Server startup is handled in index.js

module.exports = {
  app
};