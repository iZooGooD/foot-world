import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import HomeLayout from './routes/home-layout';
import './styles/index.scss';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout />} />
      </Routes>
    </Router>
  );
}
