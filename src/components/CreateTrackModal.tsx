import { useState } from "react";
import { createTrack } from "../api/tracks";

export type TrackFormData = {
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  genres: string[];
};

interface CreateTrackModalProps {
  onClose: () => void;
  onSubmit?: (track: TrackFormData) => void; 
}

export default function CreateTrackModal({ onClose, onSubmit }: CreateTrackModalProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    title: "",
    artist: "",
    genres: "",
  });

  const validate = () => {
    const newErrors = { title: "", artist: "", genres: "" };
    if (!title.trim()) newErrors.title = "Title is required";
    if (!artist.trim()) newErrors.artist = "Artist is required";
    if (genres.length === 0) newErrors.genres = "At least one genre required";
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const track: TrackFormData = {
      title,
      artist,
      album,
      genres,
      coverImage,
    };

    try {
      await createTrack(track);
      if (onSubmit) onSubmit(track);
      onClose();
    } catch (error) {
      console.error("Failed to create track:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg space-y-4"
        data-testid="track-form"
      >
        <h2 className="text-xl font-bold">Create Track</h2>

        <div>
          <input
            data-testid="input-title"
            type="text"
            placeholder="Title"
            className="input w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-red-500 text-sm" data-testid="error-title">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <input
            data-testid="input-artist"
            type="text"
            placeholder="Artist"
            className="input w-full"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
          {errors.artist && (
            <p className="text-red-500 text-sm" data-testid="error-artist">
              {errors.artist}
            </p>
          )}
        </div>

        <input
          data-testid="input-album"
          type="text"
          placeholder="Album"
          className="input w-full"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
        />

        <input
          data-testid="input-cover-image"
          type="text"
          placeholder="Cover Image URL"
          className="input w-full"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />

        <div>
          <label className="block mb-1">Genres</label>
          <div
            data-testid="genre-selector"
            className="flex flex-wrap gap-2 border p-2 rounded"
          >
            {genres.map((g, i) => (
              <span
                key={i}
                className="bg-gray-200 rounded px-2 py-1 flex items-center"
              >
                {g}
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() =>
                    setGenres(genres.filter((genre) => genre !== g))
                  }
                >
                  ×
                </button>
              </span>
            ))}
            <button
              type="button"
              className="text-blue-500 underline"
              onClick={() => {
                const newGenre = prompt("Add Genre:");
                if (newGenre && !genres.includes(newGenre)) {
                  setGenres([...genres, newGenre]);
                }
              }}
            >
              + Add
            </button>
          </div>
          {errors.genres && (
            <p className="text-red-500 text-sm" data-testid="error-genre">
              {errors.genres}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            data-testid="submit-button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
