import Searchbox from 'renderer/components/searchbox';
import Container from 'renderer/components/container';
import { getHighlightFootballPageData } from 'renderer/utils/operations';

const HomeLayout = () => {
  getHighlightFootballPageData().then(response=>{
     console.log(response);
  })
  return (
    <div className="main-container">
      <Searchbox />
      <div className="main-content">
        <Container />
      </div>
    </div>
  );
};

export default HomeLayout;
