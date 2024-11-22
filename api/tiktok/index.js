const fetch = require("node-fetch");

/**
 * @swagger
 * /tiktok:
 *   get:
 *     summary: Fetch TikTok video with detailed info.
 *     description: Fetch TikTok video with detailed info. Include download url, author metadata, song metadata, and etc.
 *     parameters:
 *     - in: apikey
 *       name: API Key
 *     - in: url
 *       name: URL
 *     responses:
 *       200:
 *         description: JSON Object as responses.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

async function handler(req, res) {
  if (!req.query || Object.values(req.query).length < 1)
    res.status(400).json({ statusCode: 400, message: "Query is undefined." });
  let aa = req.query;
  console.log(aa);
  if (aa.apikey) {
    if (aa.url) {
      let landingVideoUrl = "";
      if (aa.url.match(/(vm|jp).tiktok/gi)) {
        landingVideoUrl = await (
          await fetch(aa.url, { redirect: "manual" })
        ).headers.get("location");
        console.log(landingVideoUrl);
        landingVideoUrl = landingVideoUrl.split("?")[0];
      } else landingVideoUrl = aa.url;
      console.log(landingVideoUrl);
      let dat = new URLSearchParams({
        server: "snaptik",
        url: landingVideoUrl,
        type: "json",
      });
      let json = await fetch(
        "https://tiktokjs-downloader.vercel.app/api/v1/snaptik",
        {
          method: "POST",
          body: dat.toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      ).then((r) => r.text());
      json = JSON.parse(json);
      delete json.data.status;
      delete json.data.data;
      return res.status(200).json({ statusCode: 200, data: json });
    } else {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Query 'url' is undefined." });
    }
  } else {
    return res
      .status(400)
      .json({ statusCode: 400, message: "Query 'apikey' is undefined." });
  }
}

//router.get("/tiktok", handler);

module.exports = handler;
