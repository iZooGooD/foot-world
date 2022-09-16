import axios from 'axios';



const Matchcard = (props) => {
  const { title, backgroundImageLink, matchLink, source } = props.matchDetails;

  return (
    <div className="match-card">
      <div className="source-image">
        <img src={backgroundImageLink}/>
      </div>
      <h3>{title}</h3>
    </div>
  );
};

export default Matchcard;
