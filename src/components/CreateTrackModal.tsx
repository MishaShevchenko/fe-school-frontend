import { useState, useEffect } from "react";
import { createTrack } from "../api/tracks";
import { toast } from "react-toastify";
import api from "../api/axios";

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
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [errors, setErrors] = useState({ title: "", artist: "", genres: "" });
  const [audioFile, setAudioFile] = useState<File | undefined>();
  const [audioError, setAudioError] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get("/api/genres");
        setAllGenres(response.data);
      } catch {
        toast.error("Failed to load genres");
      }
    };
    fetchGenres();
  }, []);

  const validate = () => {
    const newErrors = { title: "", artist: "", genres: "" };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!artist.trim()) {
      newErrors.artist = "Artist is required";
      isValid = false;
    }
    if (genres.length === 0) {
      newErrors.genres = "At least one genre is required";
      isValid = false;
    }

    if (!audioFile) {
      setAudioError("Audio file is required");
      isValid = false;
    } else if (audioFile.type !== "audio/mpeg") {
      setAudioError("Only MP3 files are allowed");
      isValid = false;
    } else if (audioFile.size > 10 * 1024 * 1024) {
      setAudioError("File size must not exceed 10MB");
      isValid = false;
    } else {
      setAudioError("");
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const newTrack = {
      title,
      artist,
      album,
      coverImage,
      genres,
    };

    try {
      const createdTrack = await createTrack(newTrack);

      if (audioFile) {
        const formData = new FormData();
        formData.append("file", audioFile);
        await api.post(`/api/tracks/${createdTrack.id}/upload`, formData);
      }

      toast.success(`Track "${title}" was created successfully 🎉`);
      if (onSubmit) onSubmit(createdTrack);
      onClose();
    } catch (err) {
      console.error("Failed to create track:", err);
      toast.error("Failed to create track. Please try again.");
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

        <input
          data-testid="input-title"
          type="text"
          placeholder="Title"
          className="input w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="text-red-500 text-sm" data-testid="error-title">{errors.title}</p>}

        <input
          data-testid="input-artist"
          type="text"
          placeholder="Artist"
          className="input w-full"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        {errors.artist && <p className="text-red-500 text-sm" data-testid="error-artist">{errors.artist}</p>}

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
          <div className="flex flex-wrap gap-2 border p-2 rounded" data-testid="genre-selector">
            {genres.map((genre, i) => (
              <span key={i} className="bg-gray-200 rounded px-2 py-1 flex items-center">
                {genre}
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => setGenres(genres.filter((g) => g !== genre))}
                >
                  ×
                </button>
              </span>
            ))}

            <select
              className="input"
              onChange={(e) => {
                const selected = e.target.value;
                if (selected && !genres.includes(selected)) {
                  setGenres([...genres, selected]);
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Select genre
              </option>
              {allGenres.map((g, i) => (
                <option key={i} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          {errors.genres && <p className="text-red-500 text-sm" data-testid="error-genre">{errors.genres}</p>}
        </div>

        <div>
          <label htmlFor="audio" className="block mb-1">
            Audio File
          </label>
          <input
            data-testid="audio-input"
            id="audio"
            type="file"
            accept="audio/mpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setAudioFile(file);
            }}
          />
          {audioError && <p className="text-red-500 text-sm" data-testid="error-audio">{audioError}</p>}
        </div>

        {audioFile && (
          <div className="bg-gray-100 p-2 rounded flex items-center justify-between mt-2">
            <span className="text-sm truncate">{audioFile.name}</span>
            <button
              type="button"
              className="text-red-500 text-sm"
              onClick={() => setAudioFile(undefined)}
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button type="submit" data-testid="submit-button" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
