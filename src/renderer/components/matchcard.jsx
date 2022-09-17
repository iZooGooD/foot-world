import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  findMp3u8Link,
  buildLinksForDownload,
  download,
} from 'renderer/utils/operations';
import { ColorRing } from 'react-loader-spinner';

const Matchcard = (props) => {
  const { title, backgroundImageLink, matchLink, source } = props.matchDetails;
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [hasGeneratedDownloadLink, setHasGeneratedDownloadLink] =
    useState(false);
  const [hasStartedDownload, setHasStartedDownload] = useState(false);
  const [hasFinishedDownloading, setHasFinishedDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({});
  const onDownload = async () => {
    const link = await findMp3u8Link(matchLink);
    const availableResolutions = await buildLinksForDownload(link);
    setDownloadLinks(availableResolutions);
    setHasGeneratedDownloadLink(true);
  };

  const onStartDownload = async (url, format, fileName) => {
    setHasStartedDownload(true);
    await download(url, format, fileName, (status) => {
      setDownloadProgress(status);
      if (status.segmentProcessed === status.maxSegments) {
        setHasStartedDownload(false);
        setHasFinishedDownloading(true);
      }
    });
  };

  return (
    <div className="match-card">
      <div className="source-image-container">
        <img className="source_image" src={backgroundImageLink} alt={title} />
      </div>
      <div className="video-information">
        <p className="match-title">Title: {title}</p>
        <small className="match-source">Source: {source}</small>
        <ColorRing
          height="50"
          width="50"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass="spinner-loader"
          visible={hasStartedDownload}
        />
        {hasGeneratedDownloadLink === true && (
          <div className="generated_links">
            <p>Available formats:</p>
            {downloadLinks.map((item) => (
              <button
                disabled={hasStartedDownload}
                className="formats-button"
                type="button"
                onClick={() =>
                  onStartDownload(item.downloadLink, item.resolution, title)
                }
              >
                {item.resolution}
              </button>
            ))}
          </div>
        )}
        {hasStartedDownload === true && downloadProgress.progress !== 100.0 && (
          <div className="download-stats">
            <p>
              Download progress: {downloadProgress.progress}%{' '}
              {downloadProgress.mbDownloaded}mb
            </p>
          </div>
        )}
        {hasFinishedDownloading && (
          <small>
            Your file was successfully downloaded to your downloads folder.
          </small>
        )}
      </div>
      <button
        type="button"
        disabled={hasStartedDownload}
        onClick={onDownload}
        className="download-button"
      >
        Download
      </button>
    </div>
  );
};

export default Matchcard;
