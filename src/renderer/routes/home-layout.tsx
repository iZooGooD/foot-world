import Searchbox from 'renderer/components/searchbox';
import Container from 'renderer/components/container';
import { useEffect, useState } from 'react';
import { getHighlightFootballPageData } from 'renderer/utils/operations';

const HomeLayout = () => {
  const [matches, setMatches] = useState([]);
  useEffect(() => {
    getHighlightFootballPageData()
      .then((data) => {
        setMatches(data);
        return data;
      })
      .catch(() => {});
  }, []);
  return (
    <div className="main-container">
      <Searchbox />
      <div className="main-content">
        <Container matches={matches} />
      </div>
    </div>
  );
};

export default HomeLayout;
