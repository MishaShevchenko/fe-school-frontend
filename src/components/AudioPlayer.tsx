import { useRef, useEffect, useState } from 'react'

type Props = {
  id: string | number
  src: string
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
}

const AudioPlayer = ({ id, src, isPlaying, onPlay, onPause }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio && audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100
      setProgress(percent)
    }
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  return (
    <div data-testid={`audio-player-${id}`} className="mt-2 w-full">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onPause}
      />

      <div className="flex items-center gap-2">
        {isPlaying ? (
          <button
            onClick={onPause}
            data-testid={`pause-button-${id}`}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={onPlay}
            data-testid={`play-button-${id}`}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            Play
          </button>
        )}

        <div
          data-testid={`audio-progress-${id}`}
          className="h-2 w-full bg-gray-300 rounded overflow-hidden"
        >
          <div
            className="h-2 bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
