import { useState } from 'react';

function TracksPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <h1 data-testid="tracks-header" className="text-2xl font-bold mb-4">
        Tracks
      </h1>

      <button
        data-testid="create-track-button"
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setIsOpen(true)}
      >
        Create Track
      </button>

      {/* Тут пізніше буде modal */}
      {isOpen && (
        <div className="mt-8 p-4 border border-gray-300 rounded bg-gray-100">
          Modal for Create Track (заглушка)
        </div>
      )}
    </div>
  );
}

export default TracksPage;
