const axios = require('axios').default;
const HTMLParser = require('node-html-parser');
const m3u8stream = require('m3u8stream');
const fs = require('fs');

const CONFIG = {
  headers: {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
  },
};
const VIDEO_KEY_HF = 'highlightsfootball.net/video';
const HIGHLIGHTS = 'Highlights';

const getHighlightFootballPageData = async () => {
  const results = [];
  const response = await axios.get('https://highlightsfootball.net/', CONFIG);
  const rawHtmlData = response.data;
  const regexImage = /(https?:\/\/.*\.(?:png|jpeg|jpg))/i;
  const root = HTMLParser.parse(rawHtmlData);
  const anchorTags = root.querySelectorAll('a');
  const links = anchorTags.filter((tag) => {
    return (
      tag.getAttribute('href') &&
      tag.rawAttrs?.includes(VIDEO_KEY_HF) &&
      tag.getAttribute('title')?.includes(HIGHLIGHTS)
    );
  });
  links.forEach((link) => {
    try {
      const backgroundImageLink = link.firstChild
        .getAttribute('style')
        ?.match(regexImage)[0];
      const matchLink = link.getAttribute('href');
      const title = link.getAttribute('title');
      if (backgroundImageLink && matchLink && title) {
        results.push({
          backgroundImageLink,
          matchLink,
          title,
          source: 'highlightsfootball',
        });
      }
    } catch (e) {
      // do nothing
    }
  });
  return results;
};

const findMp3u8Link = async (pageLink) => {
  const response = await axios.get(`${pageLink}`, CONFIG);
  const rawHtmlData = response.data;
  const regexM3U8 = /(?<link>http\S+\.m3u8)/;
  const mp3u8Url = rawHtmlData.match(regexM3U8)[0].replaceAll('\\', '');
  return mp3u8Url ?? '';
};

const download = async (url, format) => {
  const stream = m3u8stream(url);
  stream.pipe(fs.createWriteStream('videofile.mp4'));
  stream.on('progress', (segment, totalSegments, downloaded) => {
    console.log(
      `${segment.num} of ${totalSegments} segments ` +
        `(${((segment.num / totalSegments) * 100).toFixed(2)}%) ` +
        `${(downloaded / 1024 / 1024).toFixed(2)}MB downloaded`
    );
  });
};

const buildLinksForDownload = async (url) => {
  const response = await axios.get(`${url}`, CONFIG);
  const resultSet = [];
  const { data } = response;
  // sample response:
  // #EXTM3U
  // #EXT-X-VERSION:3
  // #EXT-X-STREAM-INF:BANDWIDTH=700416,RESOLUTION=640x360
  // 360p.m3u8
  // #EXT-X-STREAM-INF:BANDWIDTH=2093056,RESOLUTION=1280x720
  // 720p.m3u8
  if (data) {
    const availableFormats = data.match(/.*.m3u8/g);
    let downloadLink;
    availableFormats.forEach((format) => {
      switch (format.split('.')[0]) {
        case '360p':
          downloadLink = url.replace('0.m3u8', format);
          resultSet.push({ resolution: '360p', downloadLink });
          break;
        case '720p':
          downloadLink = url.replace('0.m3u8', format);
          resultSet.push({ resolution: '720p', downloadLink });
          break;
        case '1080p':
          downloadLink = url.replace('0.m3u8', format);
          resultSet.push({ resolution: '1080p', downloadLink });
          break;
        default:
          // do nothing
          break;
      }
    });
  }
  return resultSet;
};

export {
  getHighlightFootballPageData,
  findMp3u8Link,
  download,
  buildLinksForDownload,
};
