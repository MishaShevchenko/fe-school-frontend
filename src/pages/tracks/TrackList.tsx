import { useEffect, useState } from 'react';
import { getTracks, deleteTrack } from '../../api/tracks';
import EditTrackModal from '../../components/EditTrackModal';
import AudioPlayer from '../../components/AudioPlayer';
import { Track } from '../../types';
import { toast } from 'react-hot-toast';

type Props = {
  page: number;
  limit: number;
  sort: string;
  search: string;
  genre: string;
  setTotalPages: (totalPages: number) => void;
};

const TrackList = ({
  page,
  limit,
  sort,
  search,
  genre,
  setTotalPages,
}: Props) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [erroredImages, setErroredImages] = useState<Record<number, boolean>>({});

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const params = { page, limit, sort, search, genre };
      const response = await getTracks(params);
      setTracks(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, [page, limit, sort, search, genre]);

  const getSafeImageSrc = (url?: string) => {
    if (!url || typeof url !== 'string' || !/^https?:\/\//.test(url)) {
      return '';
    }
    return url;
  };

  if (loading) return <div data-testid="loading-tracks">Loading tracks...</div>;

  return (
    <div data-testid="track-list">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="border p-2 my-2 rounded"
          data-testid={`track-item-${track.id}`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {!erroredImages[track.id] && getSafeImageSrc(track.coverImage) ? (
                <img
                  src={getSafeImageSrc(track.coverImage)}
                  alt="Cover"
                  onError={() =>
                    setErroredImages((prev) => ({ ...prev, [track.id]: true }))
                  }
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs text-center p-1">
                  {track.title}
                </div>
              )}

              <div>
                <div data-testid={`track-item-${track.id}-title`}>
                  <strong>{track.title}</strong>
                </div>
                <div data-testid={`track-item-${track.id}-artist`}>
                  {track.artist}
                </div>
                <div>{track.album}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                data-testid={`edit-track-${track.id}`}
                onClick={() => setEditingTrack(track)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                data-testid={`delete-track-${track.id}`}
                onClick={() => setTrackToDelete(track)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>

          {track.audioFile && (
            <div className="mt-2">
              <AudioPlayer
                id={String(track.id)}
                src={track.audioFile}
                isPlaying={playingTrackId === String(track.id)}
                onPlay={() => setPlayingTrackId(String(track.id))}
                onPause={() => setPlayingTrackId(null)}
              />
            </div>
          )}
        </div>
      ))}

      {editingTrack && (
        <EditTrackModal
          track={editingTrack}
          onClose={() => setEditingTrack(null)}
          onSave={() => {
            fetchTracks();
            setEditingTrack(null);
          }}
        />
      )}

      {trackToDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          data-testid="confirm-dialog"
        >
          <div className="bg-white p-4 rounded w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Delete Track</h2>
            <p className="mb-4">
              Are you sure you want to delete "{trackToDelete.title}"?
            </p>
            <div className="flex justify-end gap-2">
              <button
                data-testid="cancel-delete"
                onClick={() => setTrackToDelete(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                data-testid="confirm-delete"
                onClick={async () => {
                  try {
                    setDeleting(true);
                    await deleteTrack(trackToDelete.id);
                    await fetchTracks();
                    toast.success('Track deleted successfully');
                  } catch {
                    toast.error('Failed to delete track');
                  } finally {
                    setTrackToDelete(null);
                    setDeleting(false);
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackList;
