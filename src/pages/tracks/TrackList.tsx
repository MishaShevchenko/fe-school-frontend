import { useEffect, useState } from 'react'
import { getTracks } from '../../api/tracks'

type Track = {
  id: number
  title: string
  artist: string
  album: string
}

const TrackList = () => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTracks = async () => {
      try {        
        const data = await getTracks()
        console.log('Tracks API data:', data) // 👈 сюда вставляй

        setTracks(data.data)
      } catch (error) {
        console.error('Failed to load tracks:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTracks()
  }, [])

  if (loading) return <div>Loading tracks...</div>

  return (
    <div>
      {tracks.map((track) => (
        <div key={track.id} className="border p-2 my-2 rounded">
          <div><strong>{track.title}</strong></div>
          <div>{track.artist}</div>
          <div>{track.album}</div>
        </div>
      ))}
    </div>
  )
}

export default TrackList
