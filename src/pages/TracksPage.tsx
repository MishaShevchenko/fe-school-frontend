import { useState } from 'react'
import TrackList from './tracks/TrackList'

function TracksPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-4">
      <h1 data-testid="tracks-header" className="text-2xl font-bold mb-4">
      Track List
      </h1>
    <button
        data-testid="create-track-button"
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setIsOpen(true)}
      >
        Create Track
      </button>
      <input className='mx-4 px-4 py-2 bg-blue-600 text-white rounded'  data-testid="search-input" placeholder="Search..." />
      <select className=' py-2 px-4 bg-blue-600 text-white rounded' data-testid="sort-select">
  <option value="title">Title</option>
  <option value="artist">Artist</option>
</select>
<select className='mx-4  px-4 py-2 bg-blue-600 text-white rounded' data-testid="filter-genre">
  <option value="">All Genres</option>
</select>
<select  className=' py-2 px-4 bg-blue-600 text-white rounded' data-testid="filter-artist">
  <option value="">All Artists</option>
</select>
<div data-testid="pagination" className=' my-4 px-4 py-2 bg-blue-600 text-white rounded'>
  <button data-testid="pagination-prev">Previous</button>
  <span>Page 1</span>
  <button data-testid="pagination-next">Next</button>
</div>
      


      {/* 📦 Список треків */}
      <TrackList />

      {/* 🔜 Модалка потім */}
      {isOpen && (
        <div className="mt-8 p-4 border border-gray-300 rounded bg-gray-100">
          Modal for Create Track (заглушка)
        </div>
      )}
    </div>
  )
}

export default TracksPage
