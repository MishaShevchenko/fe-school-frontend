import { Routes, Route, Navigate } from 'react-router-dom';
import TracksPage from './pages/TracksPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/tracks" />} />
        <Route path="/tracks" element={<TracksPage />} />
      </Routes>

      {/* Toasts should be outside of Routes */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
