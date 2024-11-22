const path = require("path");

module.exports = {
    aldnoah: require(path.join(__dirname, "./aldnoah")),
  tiktok: require(path.join(__dirname, "./tiktok")),
  insta: require(path.join(__dirname, "./instagram")),
  serverinfo: require(path.join(__dirname, "./serverinfo")),
  ytb: require(path.join(__dirname, "./ytdl")),
};
