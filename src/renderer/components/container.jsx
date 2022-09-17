import MatchCard from './matchcard';

const Container = (props) => {
  const { matches } = props;
  return (
    <div className="trending_videos">
      {matches.map((match) => {
        return <MatchCard matchDetails={match} />;
      })}
    </div>
  );
};
export default Container;
