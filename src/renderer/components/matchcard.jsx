import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  findMp3u8Link,
  buildLinksForDownload,
  download,
} from 'renderer/utils/operations';

const Matchcard = (props) => {
  const { title, backgroundImageLink, matchLink, source } = props.matchDetails;
  const [downloadLinks,setDownloadLinks] = useState([]);
  const [hasGeneratedDownloadLink, setHasGeneratedDownloadLink] =
    useState(false);
  const onDownload = async () => {
    const link = await findMp3u8Link(matchLink);
    const availableResolutions = await buildLinksForDownload(link);
    setDownloadLinks(availableResolutions);
    setHasGeneratedDownloadLink(true);
  };

  const onStartDownload = async (url, format) => {
    download(url, format);
  };

  return (
    <div className="match-card">
      <div className="source-image-container">
        <img className="source_image" src={backgroundImageLink} alt={title} />
      </div>
      <div className="video-information">
        <p>{title}</p>
        <p>Source: {source}</p>
        <button type="button" onClick={onDownload} className="download-button">
          Download
        </button>
        {hasGeneratedDownloadLink === true && (
          <div className="generated_links">
            {downloadLinks.map((item) => (
              <button type="button" onClick={()=>onStartDownload(item.downloadLink,item.resolution)}>{item.resolution}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matchcard;
