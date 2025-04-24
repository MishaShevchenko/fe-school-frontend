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

  const fullAudioSrc = `${import.meta.env.VITE_API_URL}/uploads/${src}`

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => {
      audio.play().catch((err) => {
        console.error('Playback error:', err)
      })
    }

    if (isPlaying) {
      if (audio.readyState >= 3) {
        // Если уже готов — просто играем
        handlePlay()
      } else {
        // Если нет — ждём canplay
        audio.addEventListener('canplay', handlePlay, { once: true })
      }
    } else {
      audio.pause()
    }

    // Чистим слушатель при размонтировании или переключении
    return () => {
      audio.removeEventListener('canplay', handlePlay)
    }
  }, [isPlaying, fullAudioSrc]) // важно следить за fullAudioSrc

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio && audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100
      setProgress(percent)
    }
  }

  useEffect(() => {
    return () => {
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [])

  return (
    <div data-testid={`audio-player-${id}`} className="mt-2 w-full">
      <audio
       key={fullAudioSrc}
        ref={audioRef}
        src={fullAudioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onPause}
        preload="auto"
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
