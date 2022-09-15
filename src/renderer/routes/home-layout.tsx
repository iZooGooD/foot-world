import Searchbox from 'renderer/components/searchbox';

const HomeLayout = () => {
  return (
    <div className="main-container">
      <Searchbox />
      <div className="main-content" />
    </div>
  );
};

export default HomeLayout;
