const play = require("@vookav2/play-dl");
const UserAgent = require("user-agents");

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
 */

async function mp3(url, format = "mp3") {
  try {
    const userAgent = new UserAgent({ deviceCategory: 'mobile' });
    await play.setToken({
      youtube: {
        cookie:
          "__Secure-3PSID=g.a000qQhT_BHF-HTY726buLTldMsT5MHprXgluTeDxwfZDc-5F5liAA0Javntlv8HokA-R27QxgACgYKAWYSARESFQHGX2Miw136Ozwlg0bF0j3e3KgFoRoVAUF8yKo1KLw2ODlTx6lLQ9_aINcY0076;SIDCC=AKEyXzV62GBBVyCuAaULjTRvMHkTkY6sOX9tkS4vq9-kx4tN4NXMvsjR01esSn7yHdGF22-ZnQ;SID=g.a000qQhT_BHF-HTY726buLTldMsT5MHprXgluTeDxwfZDc-5F5li29yQDr8NMuz3Fw16ZO6GEgACgYKAXcSARESFQHGX2MitdiY5gq9YJAA-NeNwIJxQRoVAUF8yKq9N0l1Lb4Q8m_4djljda4y0076;__Secure-1PSIDTS=sidts-CjEBQT4rXzV0BMoQB6APPrVKi6FjpluG3RizLXawM_DHwZo9v0b_McKOTaKG4v6Yu61EEAA;SAPISID=2kESpX7jdI33qWpv/A4tLd3famIEZDxEvE;__Secure-1PSIDCC=AKEyXzUK_gK1O5-DmABneeRBfKJN2c-TYzs9HNYT0Pb-YhDK-a23QhCfD6Fjw1vX7TpQrjQAATE;SSID=AHGMig17IDAFCBFPh;__Secure-1PAPISID=2kESpX7jdI33qWpv/A4tLd3famIEZDxEvE;__Secure-1PSID=g.a000qQhT_BHF-HTY726buLTldMsT5MHprXgluTeDxwfZDc-5F5liHnICgS2OrYIBi-hDd8tqbAACgYKAQ8SARESFQHGX2MikREuSyg5Tbd0a8PmUjhWmxoVAUF8yKrvVVg4QPDCTJvChPs_Mfpv0076;__Secure-3PAPISID=2kESpX7jdI33qWpv/A4tLd3famIEZDxEvE;__Secure-3PSIDCC=AKEyXzWmgkcYEfXCrc1A_0xSVci6imbuRND0QoDoRdMzw28HjUQ-xxK7mEyLpOBK7LicSvyflQ;__Secure-3PSIDTS=sidts-CjEBQT4rXzV0BMoQB6APPrVKi6FjpluG3RizLXawM_DHwZo9v0b_McKOTaKG4v6Yu61EEAA;APISID=ls8Sg89MKksG0CQ1/Api5pw2p51QqvT_DL;HSID=AFxfvYoCQiJP_Gl5y;LOGIN_INFO=AFmmF2swRAIgNgKW8jUv1UaAKqer6-n5jiodT9MfNxZMRaJOq9I1cNECICYxWurRy3Ob9UEzj5yjAdutt8Q7agcj2X1oJvZeZQUT:QUQ3MjNmeGJxWnBWYkJzNlNTNVRWd0N2TVBYanRlZHhXTy1CVXhVQ01vZWVFU21oWjRYUHJxSnZ5REFUUVFkQ0VPcWM0ajJ5MTlFY21vRUZLa2FYVUI2Y2JwSGtGQjJtUzJ1OWpSMk9XN0phTEtoZ3c4VHp6WXV6UlpiRWQ0d2ZMRmNwcFM3c25DbkhZQ3RVTEVJR3RNTDQySnJsakpoRDln;PREF=tz=Asia.Jakarta&f6=40000000&f5=30000&f7=140",
      },
      useragent: [userAgent.random()]
    }); // YouTube Cookies
    const videoInfo = await play.video_info(url);
    const audioFormats = await videoInfo.format().filter((f) => f.isAudioOnly);

    // Pilih format audio yang sesuai
    const selectedFormat =
      audioFormats.find((f) => f.codec.includes(format)) || audioFormats[0];

    // Format data sesuai dengan struktur response yang diinginkan
    return {
      title: videoInfo.video_details.title,
      thumbnail: videoInfo.video_details.thumbnail.url,
      duration: videoInfo.video_details.durationInSec,
      duration_string: new Date(videoInfo.video_details.durationInSec * 1000)
        .toISOString()
        .substr(11, 8),
      likes: videoInfo.video_details.likes,
      views: videoInfo.video_details.views,
      upload_date_string: new Date(videoInfo.video_details.uploadedAt)
        .toISOString()
        .split("T")[0]
        .replace(/-/g, ""),
      uploader: videoInfo.video_details.channel.name,
      audio: {
        url: selectedFormat.url,
        filesize: selectedFormat.size,
        ext: format,
        acodec: selectedFormat.codec,
        quality: selectedFormat.quality,
      },
    };
  } catch (error) {
    console.error("Error in mp3:", error);
    throw error;
  }
}

async function mp4(url, resolution) {
  try {
    const userAgent = new UserAgent({ deviceCategory: 'mobile' });
    await play.setToken({
      youtube: {
        cookie:
          "__Secure-3PSID=g.a000qQhT_BHF-HTY726buLTldMsT5MHprXgluTeDxwfZDc-5F5liAA0Javntlv8HokA-R27QxgACgYKAWYSARESFQHGX2Miw136Ozwlg0bF0j3e3KgFoRoVAUF8yKo1KLw2ODlTx6lLQ9_aINcY0076;SIDCC=AKEyXzV62GBBVyCuAaULjTRvMHkTkY6sOX9tkS4vq9-kx4tN4NXMvsjR01esSn7yHdGF22-ZnQ;SID=g.a000qQhT_BHF-HTY726buLTldMsT5MHprXgluTeDxwfZDc-5F5li29yQDr8NMuz3Fw16ZO6GEgACgYKAXcSARESFQHGX2MitdiY5gq9YJAA-NeNwIJxQRoVAUF8yKq9N0l1Lb4Q8m_4djljda4y0076;__Secure-1PSIDTS=sidts-CjEBQT4rXzV0BMoQB6APPrVKi6FjpluG3RizLXawM_DHwZo9v0b_McKOTaKG4v6Yu61EEAA;SAPISID=2kESpX7jdI33qWpv/A4tLd3famIEZDxEvE;__Secure-1PSIDCC=AKEyXzUK_gK1O5-DmABneeRBfKJN2c-TYzs9HNYT0Pb-YhDK-a23QhCfD6Fjw1vX7TpQrjQAATE;SSID=AHGMig17IDAFCBFPh;__Secure-1PAPISID=2kESpX7jdI33qWpv/A4tLd3famIEZDxEvE;__Secure-1PSID=g.a000qQhT_BHF-HTY726buLTldMsT5MHprXgluTeDxwfZDc-5F5liHnICgS2OrYIBi-hDd8tqbAACgYKAQ8SARESFQHGX2MikREuSyg5Tbd0a8PmUjhWmxoVAUF8yKrvVVg4QPDCTJvChPs_Mfpv0076;__Secure-3PAPISID=2kESpX7jdI33qWpv/A4tLd3famIEZDxEvE;__Secure-3PSIDCC=AKEyXzWmgkcYEfXCrc1A_0xSVci6imbuRND0QoDoRdMzw28HjUQ-xxK7mEyLpOBK7LicSvyflQ;__Secure-3PSIDTS=sidts-CjEBQT4rXzV0BMoQB6APPrVKi6FjpluG3RizLXawM_DHwZo9v0b_McKOTaKG4v6Yu61EEAA;APISID=ls8Sg89MKksG0CQ1/Api5pw2p51QqvT_DL;HSID=AFxfvYoCQiJP_Gl5y;LOGIN_INFO=AFmmF2swRAIgNgKW8jUv1UaAKqer6-n5jiodT9MfNxZMRaJOq9I1cNECICYxWurRy3Ob9UEzj5yjAdutt8Q7agcj2X1oJvZeZQUT:QUQ3MjNmeGJxWnBWYkJzNlNTNVRWd0N2TVBYanRlZHhXTy1CVXhVQ01vZWVFU21oWjRYUHJxSnZ5REFUUVFkQ0VPcWM0ajJ5MTlFY21vRUZLa2FYVUI2Y2JwSGtGQjJtUzJ1OWpSMk9XN0phTEtoZ3c4VHp6WXV6UlpiRWQ0d2ZMRmNwcFM3c25DbkhZQ3RVTEVJR3RNTDQySnJsakpoRDln;PREF=tz=Asia.Jakarta&f6=40000000&f5=30000&f7=140",
      },
      useragent: [userAgent.random()]
    }); // YouTube Cookies
    const videoInfo = await play.video_info(url);
    const videoFormats = videoInfo.format || [];

    // Pilih format video berdasarkan resolusi
    const height = parseInt(resolution);
    const selectedFormat =
      videoFormats.find((f) => f.quality === resolution && f.hasAudio) ||
      videoFormats[0];
    console.log("\n\nSelected Formats:\n", selectedFormat);

    return {
      title: videoInfo.video_details.title,
      desc: videoInfo.video_details.description,
      thumbnail:
        videoInfo.video_details.thumbnails[
          videoInfo.video_details.thumbnails.length - 1
        ].url,
      duration: videoInfo.video_details.durationInSec,
      duration_string: new Date(videoInfo.video_details.durationInSec * 1000)
        .toISOString()
        .substr(11, 8),
      likes: videoInfo.video_details.likes,
      views: videoInfo.video_details.views,
      upload_date_string: new Date(videoInfo.video_details.uploadedAt)
        .toISOString()
        .split("T")[0]
        .replace(/-/g, ""),
      uploader: videoInfo.video_details.channel.name,
      video: {
        url: selectedFormat.url,
        filesize: selectedFormat.size,
        ext: "mp4",
        width: selectedFormat.width,
        height: selectedFormat.height,
        fps: selectedFormat.fps,
        vcodec: selectedFormat.codec,
        acodec: selectedFormat.audioCodec,
      },
    };
  } catch (error) {
    console.error("Error in mp4:", error);
    throw error;
  }
}

async function handler(req, res) {
  if (!req.query || Object.values(req.query).length < 1) {
    return res
      .status(400)
      .json({ statusCode: 400, message: "Query is undefined" });
  }

  if (!req.query.apikey) {
    return res.status(400).json({
      statusCode: 400,
      message: "Query 'apikey' is undefined",
    });
  }

  const { url, type, reso } = req.query;

  try {
    if (!url) {
      return res.status(400).json({
        statusCode: 400,
        message: "Query 'url' is undefined",
      });
    }

    if (!type) {
      return res.status(400).json({
        statusCode: 400,
        message: "Query 'type' is undefined",
      });
    }

    if (type.match(/vid/gi)) {
      if (!reso) {
        return res.status(400).json({
          statusCode: 400,
          message: "Query 'reso' is undefined",
        });
      }
      const result = await mp4(url, reso);
      return res.status(200).json({ status: true, data: result });
    }

    if (type.match(/aud/gi)) {
      if (!reso || reso.match(/(.*)p$/gi)) {
        return res.status(400).json({
          statusCode: 400,
          message:
            "Query 'reso' must be: 'm4a', 'mp3', 'webm'. Received " + reso,
        });
      }
      const result = await mp3(url, reso);
      return res.status(200).json({ status: true, data: result });
    }

    return res.status(400).json({
      statusCode: 400,
      message: "Invalid type. Must be 'vid' or 'aud'",
    });
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = handler;
