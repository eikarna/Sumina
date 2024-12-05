const play = require('@vookav2/play-dl');

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

async function mp3(url, format = 'mp3') {
  try {
    const videoInfo = await play.video_info(url);
    const audioFormats = await videoInfo.format().filter(f => f.isAudioOnly);
    
    // Pilih format audio yang sesuai
    const selectedFormat = audioFormats.find(f => f.codec.includes(format)) || audioFormats[0];
    
    // Format data sesuai dengan struktur response yang diinginkan
    return {
      title: videoInfo.video_details.title,
      thumbnail: videoInfo.video_details.thumbnail.url,
      duration: videoInfo.video_details.durationInSec,
      duration_string: new Date(videoInfo.video_details.durationInSec * 1000).toISOString().substr(11, 8),
      likes: videoInfo.video_details.likes,
      views: videoInfo.video_details.views,
      upload_date_string: new Date(videoInfo.video_details.uploadedAt).toISOString().split('T')[0].replace(/-/g, ''),
      uploader: videoInfo.video_details.channel.name,
      audio: {
        url: selectedFormat.url,
        filesize: selectedFormat.size,
        ext: format,
        acodec: selectedFormat.codec,
        quality: selectedFormat.quality
      }
    };
  } catch (error) {
    console.error("Error in mp3:", error);
    throw error;
  }
}

async function mp4(url, resolution) {
  try {
    const videoInfo = await play.video_info(url);
    const videoFormats = videoInfo.format || [];
    
    // Pilih format video berdasarkan resolusi
    const height = parseInt(resolution);
    const selectedFormat = videoFormats.find(f => 
      f.quality === resolution && f.hasAudio
    ) || videoFormats[0];
    console.log("\n\nSelected Formats:\n", selectedFormat);

    return {
      title: videoInfo.video_details.title,
      desc: videoInfo.video_details.description,
      thumbnail: videoInfo.video_details.thumbnails[videoInfo.video_details.thumbnails.length - 1].url,
      duration: videoInfo.video_details.durationInSec,
      duration_string: new Date(videoInfo.video_details.durationInSec * 1000).toISOString().substr(11, 8),
      likes: videoInfo.video_details.likes,
      views: videoInfo.video_details.views,
      upload_date_string: new Date(videoInfo.video_details.uploadedAt).toISOString().split('T')[0].replace(/-/g, ''),
      uploader: videoInfo.video_details.channel.name,
      video: {
        url: selectedFormat.url,
        filesize: selectedFormat.size,
        ext: 'mp4',
        width: selectedFormat.width,
        height: selectedFormat.height,
        fps: selectedFormat.fps,
        vcodec: selectedFormat.codec,
        acodec: selectedFormat.audioCodec
      }
    };
  } catch (error) {
    console.error("Error in mp4:", error);
    throw error;
  }
}

async function handler(req, res) {
  if (!req.query || Object.values(req.query).length < 1) {
    return res.status(400).json({ statusCode: 400, message: "Query is undefined" });
  }
  
  if (!req.query.apikey) {
    return res.status(400).json({
      statusCode: 400,
      message: "Query 'apikey' is undefined"
    });
  }

  const { url, type, reso } = req.query;

  try {
    if (!url) {
      return res.status(400).json({
        statusCode: 400,
        message: "Query 'url' is undefined"
      });
    }

    if (!type) {
      return res.status(400).json({
        statusCode: 400,
        message: "Query 'type' is undefined"
      });
    }

    if (type.match(/vid/gi)) {
      if (!reso) {
        return res.status(400).json({
          statusCode: 400,
          message: "Query 'reso' is undefined"
        });
      }
      const result = await mp4(url, reso);
      return res.status(200).json({ status: true, data: result });
    } 
    
    if (type.match(/aud/gi)) {
      if (!reso || reso.match(/(.*)p$/gi)) {
        return res.status(400).json({
          statusCode: 400,
          message: "Query 'reso' must be: 'm4a', 'mp3', 'webm'. Received " + reso
        });
      }
      const result = await mp3(url, reso);
      return res.status(200).json({ status: true, data: result });
    }

    return res.status(400).json({
      statusCode: 400,
      message: "Invalid type. Must be 'vid' or 'aud'"
    });

  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    });
  }
}

module.exports = handler;