const os = require("os");
const { performance } = require("perf_hooks");
const speed = require("performance-now");
const fetch = require("node-fetch");

/**
 * @swagger
 * /serverinfo:
 *   get:
 *     summary: Fetch API Server info.
 *     description: Fetch detailed API Server info, for owner only.
 *     responses:
 *       200:
 *         description: JSON Object as responses.
 */

const bytesToSize = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)));
  return Math.round(bytes / Math.pow(1000, i), 2) + " " + sizes[i];
};

function format(seconds) {
  function pad(s) {
    return (s < 10 ? "0" : "") + s;
  }
  var hours = Math.floor(seconds / (60 * 60));
  var minutes = Math.floor((seconds % (60 * 60)) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
}

async function handler(_, res) {
  let listcpus = os.cpus();
  let totalmem = bytesToSize(os.totalmem());
  let freemem = bytesToSize(os.freemem());
  let uptime = format(process.uptime());
  let hostname = os.hostname();
  let platform = os.platform();
  let old = performance.now();
  let ip_server = await fetch("https://ifconfig.me/ip");
  let neww = performance.now();
  let fetchSpeed = neww - old;
  let speeds = speed();
  return res.status(200).json({
    statusCode: 200,
    workerId: process.env.workerId,
    hostname: hostname,
    system_speed: (speeds / 60).toFixed(2) + " ms",
    fetch_speed: (fetchSpeed / 60).toFixed(2) + " ms",
    ip_server: await ip_server.text(),
    free_memory: freemem,
    total_memory: totalmem,
    runtime: uptime,
    platform: platform,
    cpus: [...listcpus],
  });
}

module.exports = handler;
