import { useEffect, useState } from 'react'
import { Track } from '../types'
import { getGenres } from '../api/genres'
import { updateTrack } from '../api/tracks'
import { replaceAudioFile } from '../api/tracks'

type Props = {
  track: Track;
  onClose: () => void;
  onSave: () => void;
};

export default function EditTrackModal({ track, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<Track>(track);
  const [genres, setGenres] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [newAudioFile, setNewAudioFile] = useState<File | null>(null);

  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch((error) => {
        console.error('Failed to fetch genres:', error);
        setGenres([]);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenresChange = (genre: string) => {
    const newGenres = formData.genres?.includes(genre)
      ? formData.genres.filter((g) => g !== genre)
      : [...(formData.genres || []), genre];
    setFormData({ ...formData, genres: newGenres });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.artist || !formData.album) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      await updateTrack(track.id, formData);
      if (newAudioFile) {
        await replaceAudioFile(track.id.toString(), newAudioFile);
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Update failed:', err);
      setError(err.message || 'Failed to save changes.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Edit Track</h2>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          placeholder="Title"
          data-testid="input-title"
        />
        <input
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          placeholder="Artist"
          data-testid="input-artist"
        />
        <input
          name="album"
          value={formData.album}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          placeholder="Album"
          data-testid="input-album"
        />

        <div className="mb-2">
          <p className="mb-1 font-medium">Genres:</p>
          {genres.map((g) => (
            <label key={g} className="block">
              <input
                type="checkbox"
                checked={formData.genres?.includes(g) || false}
                onChange={() => handleGenresChange(g)}
              />
              <span className="ml-2">{g}</span>
            </label>
          ))}
        </div>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <input
          type="file"
          accept="audio/mpeg"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setNewAudioFile(e.target.files[0]);
            }
          }}
          className="w-full mb-2"
          data-testid="audio-input"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            data-testid="submit-button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}