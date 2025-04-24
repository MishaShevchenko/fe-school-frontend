import { useState, useEffect, useCallback } from 'react';
import TrackList from './tracks/TrackList';
import { getGenres } from '../api/genres';
import CreateTrackModal, { TrackFormData } from '../components/CreateTrackModal';
import debounce from 'lodash.debounce';

function TracksPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sort, setSort] = useState('title');
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        const allGenres = ['All Genres', ...data];
        const uniqueGenres = Array.from(new Set(allGenres));
        setGenres(uniqueGenres);
      } catch (error) {
        console.error('Failed to load genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const debouncedSearchChange = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 400),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearchChange(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenre = e.target.value;
    setGenre(selectedGenre === 'All Genres' ? '' : selectedGenre);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleCreateTrack = (trackData: TrackFormData) => {
    console.log('Track created:', trackData);
    setIsOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" data-testid="tracks-header">
        Track List
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded w-full sm:w-auto"
          onClick={() => setIsOpen(true)}
          data-testid="create-track-button"
        >
          Create Track
        </button>

        <div className="flex gap-4 mt-4 sm:mt-0">
          <input
            className="px-4 py-2 bg-white border rounded w-full sm:w-auto"
            placeholder="Search..."
            onChange={handleSearchChange}
            data-testid="search-input"
          />

          <select
            className="py-2 px-4 border rounded w-full sm:w-auto"
            value={sort}
            onChange={handleSortChange}
            data-testid="sort-select"
          >
            <option value="title">Title</option>
            <option value="artist">Artist</option>
          </select>

          <select
            className="px-4 py-2 border rounded w-full sm:w-auto"
            value={genre || 'All Genres'}
            onChange={handleGenreChange}
            data-testid="filter-genre"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="my-4 space-x-4" data-testid="pagination">
        <button
          onClick={handlePrevPage}
          className="px-3 py-1 bg-blue-500 text-white rounded w-full sm:w-auto"
          data-testid="pagination-prev"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          className="px-3 py-1 bg-blue-500 text-white rounded w-full sm:w-auto"
          data-testid="pagination-next"
        >
          Next
        </button>
      </div>

      <TrackList
        page={page}
        limit={limit}
        sort={sort}
        search={search}
        genre={genre}
        setTotalPages={setTotalPages}
      />

      {isOpen && (
        <CreateTrackModal
          onClose={() => setIsOpen(false)}
          onSubmit={handleCreateTrack}
        />
      )}
    </div>
  );
}

export default TracksPage;
