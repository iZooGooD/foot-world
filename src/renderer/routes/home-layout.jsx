import { useEffect, useState } from 'react';
import { getHighlightFootballPageData } from '../utils/operations';
import Searchbox from '../components/searchbox';
import Container from '../components/container';

const HomeLayout = () => {
  const [matches, setMatches] = useState([]);
  useEffect(() => {
    getHighlightFootballPageData()
      .then((data) => setMatches(data))
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
