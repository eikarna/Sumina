const ydp = require("yt-dlp-wrap").default;
const { existsSync: es } = require("fs");
const path = require("path");
const { platform: p } = require("os");

/**
 * @swagger
 * /ytdl:
 *   get:
 *     summary: Fetch YouTube video/audio with detailed info.
 *     description: Fetch Youtube video/audio with detailed info. Include download url, author metadata, video/audio metadata, and etc.
 *     parameters:
 *     - in: apikey
 *       name: API Key
 *     - in: url
 *       name: URL
 *     - in: reso
 *       name: Resolution
 *     - in: type
 *       name: Type (vid, video / aud, audio)
 *     responses:
 *       200:
 *         description: JSON Object as responses.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

let searchVid = (property_value, array) => {
  let asHeight = property_value.substr(0, property_value.length - 1);
  console.log(asHeight);
  for (let i = 0; i < array.length; i++) {
    if (array[i].height === asHeight && array[i].acodec !== "none") {
      // delete unwanted keys
      delete array[i].http_headers;
      delete array[i].downloader_options;
      delete array[i].protocol;
      delete array[i].language;
      delete array[i].language_preference;
      delete array[i].format_id;
      delete array[i].source_preference;
      delete array[i].aspect_ratio;
      delete array[i].format;
      delete array[i].preference;
      return array[i];
    }
  }
};

let searchAud = (property_value, array) => {
  for (let i = 0; i < array.length; i++) {
    console.log(array);
    if (array[i].ext === property_value && array[i].acodec !== "none") {
      // delete unwanted keys
      delete array[i].http_headers;
      delete array[i].downloader_options;
      delete array[i].protocol;
      delete array[i].language;
      delete array[i].language_preference;
      delete array[i].format_id;
      delete array[i].source_preference;
      delete array[i].aspect_ratio;
      delete array[i].format;
      delete array[i].preference;
      console.log(array[i]);
      return array[i];
    }
  }
};

async function mp3(url, resol) {
  petParsed = path.join(
    __dirname,
    p().startsWith("win") ? "../utils/yt-dlp.exe" : "../utils/yt-dlp"
  );
  if (!es(petParsed)) {
    console.log("Downloading yt-dlp binary... Please wait..");
    await ydp.downloadFromGithub(petParsed, "2024.03.10", p());
  }
  let yd = new ydp(petParsed);
  let rawOut = await yd.execPromise(["--dump-json", url]);

  if (!rawOut || rawOut.length < 1) return "Error parsing metadata.";

  let parsedJson = JSON.parse(rawOut);

  let downList = searchAud(resol, parsedJson.formats);

  return {
    title: parsedJson.title,
    thumbnail: parsedJson.thumbnail,
    duration: parsedJson.releaseTimestamp,
    duration_string: parsedJson.duration_string,
    likes: parsedJson.like_count,
    views: parsedJson.view_count,
    upload_date_string: parsedJson.upload_date,
    uploader: parsedJson.uploader,
    audio: downList,
  };
}

async function mp4(url, resol) {
  petParsed = path.join(
    __dirname,
    p().startsWith("win") ? "../utils/yt-dlp.exe" : "../utils/yt-dlp"
  );
  if (!es(petParsed)) {
    console.log("Downloading yt-dlp binary... Please wait..");

    await ydp.downloadFromGithub(petParsed, "2024.03.10", p());
  }

  let yd = new ydp(petParsed);

  let rawOut = await yd.execPromise(["--dump-json", url]);

  if (!rawOut || rawOut.length < 1) return "Error parsing metadata.";

  let parsedJson = JSON.parse(rawOut);

  let downList = searchVid(resol, parsedJson.formats);

  // console.log(downList);

  return {
    title: parsedJson.title,
    desc: parsedJson.description,
    thumbnail: parsedJson.thumbnail,
    duration: parsedJson.releaseTimestamp,
    duration_string: parsedJson.duration_string,
    likes: parsedJson.like_count,
    views: parsedJson.view_count,
    upload_date_string: parsedJson.upload_date,
    uploader: parsedJson.uploader,
    video: downList,
  };
}

async function updateBinary() {
  const { unlink } = require("fs/promises");
  const { tmpdir } = require("os");
  petParsed = path.join(
    tmpdir(), // Menggunakan folder temporary sistem
    p().startsWith("win") ? "yt-dlp.exe" : "yt-dlp"
  );

  try {
    if (es(petParsed)) {
      await unlink(petParsed);
      console.log("Binary lama berhasil dihapus");
    }

    // Ambil versi terbaru dari Github
    const releases = await ydp.getGithubReleases(1, 1);
    const latestVersion = releases[0].tag_name;

    // Download versi terbaru
    console.log("Mengunduh binary terbaru...");
    await ydp.downloadFromGithub(petParsed, latestVersion, p());
    console.log(`Binary berhasil diperbarui ke versi ${latestVersion}`);

    return {
      status: true,
      message: `Binary berhasil diperbarui ke versi ${latestVersion}`,
    };
  } catch (error) {
    console.error("Gagal memperbarui binary:", error);
    return {
      status: false,
      message: "Gagal memperbarui binary",
      error: error.message,
    };
  }
}

async function handler(req, _) {
  if (!req.query || Object.values(req.query).length < 1)
    return { statusCode: 400, message: "Query is undefined" };
  else if (req.query.apikey) {
    let aa = req.query;
    console.log(req.query);
    if (aa.update && aa.update.match(/Adnan2k25Api/gi)) {
      let update = await updateBinary();
      return { status: true, data: update.message };
    }
    if (aa.url) {
      if (aa.type && aa.type.match(/vid/gi)) {
        if (aa.reso) {
          let bangke = await mp4(aa.url, aa.reso);
          return { statusCode: 200, data: bangke };
        } else {
          return {
            statusCode: 400,
            message: "Query 'reso' is undefined",
          };
        }
      } else if (aa.type && aa.type.match(/aud/gi)) {
        if (aa.reso && !aa.reso.match(/(.*)p$/gi)) {
          let bangke = await mp3(aa.url, aa.reso);
          return { status: true, data: bangke };
        } else {
          return {
            statusCode: 400,
            message:
              "Query 'reso' must be: 'm4a', 'mp3', 'webm'. Received " + aa.reso,
          };
        }
      } else {
        return {
          statusCode: 400,
          message: "Query 'type' is undefined",
        };
      }
    } else {
      return {
        statusCode: 400,
        message: "Query 'url' is undefined",
      };
    }
  } else
    return {
      statusCode: 400,
      message: "Query 'apikey' is undefined",
    };
}

module.exports = handler;
