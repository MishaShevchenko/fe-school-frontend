import { Routes, Route, Navigate } from 'react-router-dom';
import TracksPage from './pages/TracksPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tracks" />} />
      <Route path="/tracks" element={<TracksPage />} />
    </Routes>
  );
}

export default App;
