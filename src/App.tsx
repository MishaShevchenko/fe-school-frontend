import { Routes, Route, Navigate } from 'react-router-dom';
import TrackList from './pages/tracks/TrackList';

function App() {
  return (
     <Routes>
      <Route path="/" element={<Navigate to="/tracks" />} />
      <Route path="/tracks" element={<TrackList />} />
    </Routes>
   
  );
}

export default App;
