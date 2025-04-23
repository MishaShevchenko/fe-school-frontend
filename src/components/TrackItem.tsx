import AudioPlayer from "./AudioPlayer";

type Track = {
  id: string;
  title: string;
  artist: string;
  fileUrl?: string;
};

type Props = {
  track: Track;
  playingTrackId: string | null;
  setPlayingTrackId: (id: string | null) => void;
  onDelete: (id: string) => void;
};

export function TrackItem({ track, playingTrackId, setPlayingTrackId, onDelete }: Props) {
  const isPlaying = playingTrackId === track.id;

  const handlePlay = () => setPlayingTrackId(track.id);
  const handlePause = () => setPlayingTrackId(null);

  return (
    <div data-testid={`track-item-${track.id}`} className="p-4 border rounded mb-2">
      <div data-testid={`track-item-${track.id}-title`} className="font-bold">{track.title}</div>
      <div data-testid={`track-item-${track.id}-artist`}>{track.artist}</div>

      {track.fileUrl && (
  <>
    <AudioPlayer
      id={track.id}
      src={track.fileUrl}
      isPlaying={isPlaying}
      onPlay={handlePlay}
      onPause={handlePause}
    />
  </>
)}


      <button
        data-testid={`delete-track-${track.id}`}
        onClick={() => onDelete(track.id)}
        className="text-red-500 mt-2"
      >
        Delete
      </button>
    </div>
  );
}
