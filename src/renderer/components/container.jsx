import PropTypes from 'prop-types';
import MatchCard from './matchcard';

const Container = ({ matches }) => {
  return (
    <div className="trending_videos">
      {matches.map((match) => {
        return <MatchCard matchDetails={match} />;
      })}
    </div>
  );
};
Container.propTypes = {
  matches: PropTypes.arrayOf.isRequired,
};
export default Container;
