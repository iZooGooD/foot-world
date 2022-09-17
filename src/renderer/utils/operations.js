const axios = require('axios').default;
const HTMLParser = require('node-html-parser');
const m3u8stream = require('m3u8stream');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  headers: {},
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

const download = async (url, format, fileName, callback) => {
  const stream = m3u8stream(url);
  const DOWNLOAD_DIR = path.join(
    process.env.HOME || process.env.USERPROFILE,
    'downloads/'
  );
  const filePath = path.join(
    DOWNLOAD_DIR,
    fileName.concat('.mp4').replaceAll(' ', '_')
  );
  stream.pipe(fs.createWriteStream(filePath));
  let segmentProcessed = 0;
  let maxSegments = 0;
  let mbDownloaded = 0;
  let progress = 0;
  stream.on('progress', (segment, totalSegments, downloaded) => {
    segmentProcessed = segment.num;
    maxSegments = totalSegments;
    mbDownloaded = (downloaded / 1024 / 1024).toFixed(2);
    progress = ((segment.num / totalSegments) * 100).toFixed(2);
    callback({ segmentProcessed, maxSegments, mbDownloaded, progress });
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
