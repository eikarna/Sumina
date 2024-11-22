const fs = require("fs");
const path = require("path");

async function handler(req, res) {
  console.log(req.headers)
  if (req.method === "POST" && req.is("application/json") && req.body) {
    let decoded = Buffer.from(req.body.apikey, "base64").toString();
    let apikeyList = JSON.parse(fs.readFileSync(path.join(__dirname, "./apikey.json"), "utf8"));
    if (apikeyList.hasOwnProperty(decoded) && apikeyList[decoded].expiredTimestamp > Date.now()) {
      return res.status(200).json({
        statusCode: 200,
        verified: true,
      });
    } else {
      return res.status(403).json({
        statusCode: 403,
        verified: false,
      });
    }
  } else if (req.method === "PUT" && req.is("application/json") && req.body) {
    let bodyData = req.body;
    let decoded = Buffer.from(bodyData.apikey, "base64").toString();
    let apikeyList = JSON.parse(fs.readFileSync(path.join(__dirname, "./apikey.json"), "utf8"));
    if (bodyData.security_key && bodyData.security_key === "BuatanAdnan" && !apikeyList.hasOwnProperty(decoded) && bodyData.expiredTimestamp) {
      apikeyList[decoded] = {
        expiredTimestamp: bodyData.expiredTimestamp,
      }
      fs.writeFileSync(path.join(__dirname, "./apikey.json"), JSON.stringify(apikeyList, null, 4));
      return res.status(200).json({
        statusCode: 200,
        apikey: decoded,
        message: "Successfully added new apikey to the server.",
        expiredTimestamp: bodyData.expiredTimestamp,
      });
    } else if (bodyData.security_key && bodyData.security_key === "BuatanAdnan" && apikeyList.hasOwnProperty(decoded) && bodyData.expiredTimestamp) {
      apikeyList[decoded] = {
        expiredTimestamp: bodyData.expiredTimestamp,
      }
      fs.writeFileSync(path.join(__dirname, "./apikey.json"), JSON.stringify(apikeyList, null, 4));
      return res.status(200).json({
        statusCode: 200,
        apikey: decoded,
        message: `The apikey ${apikeyList[decoded].expiredTimestamp > Date.now() ? "has been expired" : "already added"}, and we make it more longer.`,
        expiredTimestamp: bodyData.expiredTimestamp,
      });
    } else {
      return res.status(403).json({
        statusCode: 403,
        verified: false,
      });
    }
  } else if (req.method === "DELETE" && req.is("application/json") && req.body) {
    let bodyData = req.body;
    let decoded = Buffer.from(bodyData.apikey, "base64").toString();
    let apikeyList = JSON.parse(fs.readFileSync(path.join(__dirname, "./apikey.json"), "utf8"));
    if (bodyData.security_key && bodyData.security_key === "BuatanAdnan" && apikeyList.hasOwnProperty(decoded)) {
      delete apikeyList[decoded]
      fs.writeFileSync(path.join(__dirname, "./apikey.json"), JSON.stringify(apikeyList, null, 4));
      return res.status(200).json({
        statusCode: 200,
        apikey: decoded,
        message: "Successfully delete apikey from server.",
      });
    } else {
      return res.status(403).json({
        statusCode: 403,
        apikey: decoded,
        message: "No apikey found.",
      });
    }
  } else {
    return res.status(400).json({
      statusCode: 400,
      verified: false,
    });
  }
}

module.exports = handler;
