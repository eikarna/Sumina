const express = require("express");
const app = express();
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./middlewares/swagger");
const rateLimit = require("./middlewares/ratelimit");

let bbb = 0;

// dotenv stuff
require("dotenv").config();

// Load API
const apii = require(path.join(__dirname, "./api"));

// Load API Docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Apply Rate limits
app.use(rateLimit);

// Apply JSON Parser
app.use(express.json());

// API: '/'
app.get("/", (_, res) => {
  bbb += 1;
  return res.status(200).json({
    statusCode: 200,
    data: {
      maintainer: "Eikarna",
      time: new Date(),
      reqTotal: bbb,
    },
  });
});

// API: loader.io
app.get("/loaderio-506a18e2fd6c8e6e83a5c71d78e4d8d2/", (req, res) => {
  res.send("loaderio-506a18e2fd6c8e6e83a5c71d78e4d8d2");
});

// API Routes
app.all("/aldnoah", apii.aldnoah);
app.get("/instagram", apii.insta);
app.get("/serverinfo", apii.serverinfo);
app.get("/tiktok", apii.tiktok);
app.get("/ytdl", apii.ytb);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: "Route not found"
  });
});

// Export untuk Vercel
module.exports = app;