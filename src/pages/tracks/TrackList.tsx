import { useEffect, useState } from 'react'
import { getTracks } from '../../api/tracks'

type Track = {
  id: number
  title: string
  artist: string
  album: string
}

type Props = {
  page: number
  limit: number
  sort: string
  order: 'asc' | 'desc'
  search: string
  genre: string
  setTotalPages: (totalPages: number) => void
}

const TrackList = ({
  page,
  limit,
  sort,
  order,
  search,
  genre,
  setTotalPages,
}: Props) => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true)
        const params = { page, limit, sort, order, search, genre }
        const response = await getTracks(params)
        console.log('Fetched tracks:', response.data)

        setTracks(response.data)
        setTotalPages(response.meta.totalPages)
      } catch (error) {
        console.error('Failed to fetch tracks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTracks()
  }, [page, limit, sort, order, search, genre, setTotalPages])

  if (loading) return <div>Loading tracks...</div>

  return (
    <div data-testid="track-list">
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
