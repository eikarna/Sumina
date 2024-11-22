const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

async function handler(req, res) {
  const url_post = req.query.url;
  const split_url = url_post.split("/");
  const ig_code = split_url[5];

  const url = `https://www.instagram.com/${ig_code}/?__a=1&__d=dis`;

  console.log(url);
  let json = await (
    await fetch(url, {
      headers: {
        accept: "*/*",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-asbd-id": "198387",
        "x-csrftoken": "9id7NIrYulj8aPVUSAOLvNC2nkhRRWdd",
        "x-ig-app-id": "936619743392459",
        "x-ig-www-claim":
          "hmac.AR2rCmfN1Jb98fTtIV5rXy1EHz-DxQIGk6fgEQbmFdZp0uiw",
        cookie: `sessionid=${process.env.session_Id}; ig_nrcb=1; fbm_124024574287414=base_domain=.instagram.com; ds_user_id=${process.env.ds_User_Id}; dpr=1.5; `,
        Referer: "https://www.instagram.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    })
  ).text();
  console.log(json);

  /*

  let dom = await JSDOM.fromURL(req.query.url);
  //console.log(dom.window.document.body.innerHTML)
  let aaaa = dom.window.document.querySelectorAll("img").forEach((img) => {
    console.log(img.getAttribute("src")+"\n\n");
  });
  console.log({aaaa: aaaa})
  let bbbb = aaaa.getElementsByClassName("_aagv")[0];
  console.log({bbbb: bbbb})
  let cccc = bbbb.querySelectorAll("img").forEach((img) => {
    return img.getAttribute("src")+"\n\n";
  });
  return {
    status: true,
    data: {
      url: cccc,
    },
  };
  
  console.log(json)

  if (json.hasOwnProperty("graphql")) {
    const { shortcode_media } = json.graphql;

    const { __typename: postType } = shortcode_media;

    if (
      postType != "GraphImage" &&
      postType != "GraphSidecar" &&
      postType != "GraphVideo"
    ) {
      res.json({ status: "error", details: "No Post Type Found" });
    } else {
      const { display_url: displayUrl, edge_media_to_caption } =
        shortcode_media;

      const { edges: captionCheck } = edge_media_to_caption;

      const caption = captionCheck.length == 1 ? captionCheck[0].node.text : "";

      const {
        username: owner,
        is_verified,
        profile_pic_url: profile_pic,
        full_name,
        is_private,
        edge_owner_to_timeline_media,
      } = shortcode_media.owner;

      const total_media = edge_owner_to_timeline_media.count;
      const hashtags = caption.match(/#\w+/g);

      //GraphImage = single image post
      if (postType === "GraphImage") {
        const dataDownload = displayUrl;

        res.json({
          status: "success",
          postType: "SingleImage",
          displayUrl,
          caption,
          owner,
          is_verified,
          profile_pic,
          full_name,
          is_private,
          total_media,
          hashtags,
          dataDownload,
        });

        res.end();
        //GraphSidecar = multiple post
      } else if (postType === "GraphSidecar") {
        const dataDownload = [];

        for (const post of shortcode_media.edge_sidecar_to_children.edges) {
          const { is_video, display_url, video_url } = post.node;

          const placeholder_url = !is_video ? display_url : video_url;

          dataDownload.push({
            is_video,
            placeholder_url,
          });
        }

        res.json({
          status: "success",
          postType: "MultiplePost",
          displayUrl,
          caption,
          owner,
          is_verified,
          profile_pic,
          full_name,
          is_private,
          total_media,
          hashtags,
          dataDownload,
        });

        res.end();
        //GraphVideo = video post
      } else if (postType === "GraphVideo") {
        const dataDownload = shortcode_media.owner.videoUrl;

        res.json({
          status: "success",
          postType: "SingleVideo",
          displayUrl,
          caption,
          owner,
          is_verified,
          profile_pic,
          full_name,
          is_private,
          total_media,
          hashtags,
          dataDownload,
        });

        res.end();
      }
    }
  } else {
    return { status: false, statusCode: 400, message: "Query 'url' is undefined."};
  }*/
}

module.exports = handler;
