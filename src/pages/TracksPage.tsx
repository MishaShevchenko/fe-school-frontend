import { useState, useEffect } from 'react'
import TrackList from './tracks/TrackList'
import { getGenres } from '../api/genres'

function TracksPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [sort, setSort] = useState('title')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [totalPages, setTotalPages] = useState(1)
  const [genres, setGenres] = useState<string[]>([])

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres()
        setGenres(['All Genres', ...data])
      } catch (error) {
        console.error('Failed to load genres:', error)
      }
    }

    fetchGenres()
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value)
  }

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenre = e.target.value
    setGenre(selectedGenre === 'All Genres' ? '' : selectedGenre)
    setPage(1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

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

      <input
        className="mx-4 px-4 py-2 bg-white border rounded"
        data-testid="search-input"
        placeholder="Search..."
        value={search}
        onChange={handleSearchChange}
      />

      <select
        className="py-2 px-4 border rounded"
        data-testid="sort-select"
        value={sort}
        onChange={handleSortChange}
      >
        <option value="title">Title</option>
        <option value="artist">Artist</option>
      </select>

      <select
        className="mx-4 px-4 py-2 border rounded"
        data-testid="filter-genre"
        value={genre || 'All Genres'}
        onChange={handleGenreChange}
      >
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <div data-testid="pagination" className="my-4 space-x-4">
        <button
          data-testid="pagination-prev"
          onClick={handlePrevPage}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          data-testid="pagination-next"
          onClick={handleNextPage}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>

      <TrackList
        page={page}
        limit={limit}
        sort={sort}
        order={order}
        search={search}
        genre={genre}
        setTotalPages={setTotalPages}
      />

      {isOpen && (
        <div className="mt-8 p-4 border border-gray-300 rounded bg-gray-100">
          Modal for Create Track (заглушка)
        </div>
      )}
    </div>
  )
}

export default TracksPage
