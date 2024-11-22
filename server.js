const express = require("express");
const app = express();
const path = require("path");
const cluster = require("cluster");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./middlewares/swagger");
const rateLimit = require("./middlewares/ratelimit");

let bbb = 0;

// dotenv stuff
require("dotenv").config();
const PORT = process.env.PORT || 80;
const LB = process.env.load_balance || "false";
const wkNum = parseInt(process.env.worker_count) || 64;

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
  return res.status(200).send({
    statusCode: 200,
    data: {
      maintainer: "Eikarna",
      time: new Date(),
      reqTotal: bbb,
      workerCount: wkNum,
    },
  });
});

// API: loader.io
app.get("/loaderio-506a18e2fd6c8e6e83a5c71d78e4d8d2/", (req, res) => {
  res.send("loaderio-506a18e2fd6c8e6e83a5c71d78e4d8d2");
});

// API: aldnoah
app.all("/aldnoah", apii.aldnoah)

// API: Instagram
app.get("/instagram", apii.insta);

// API: serverinfo
app.get("/serverinfo", apii.serverinfo);

// API: tiktok
app.get("/tiktok", apii.tiktok);

// API: ytdl
app.get("/ytdl", apii.ytb);

if (LB === "true") {
  if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);

    for (let i = 0; i < wkNum; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker process ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    app.listen(PORT, () => {
      console.log(`[${cluster.worker.id}] Server listening on port ${PORT}`);
    });
  }
} else {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
