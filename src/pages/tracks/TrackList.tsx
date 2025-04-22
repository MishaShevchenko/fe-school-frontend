import { useEffect, useState } from 'react'
import { getTracks } from '../../api/tracks'
import EditTrackModal from '../../components/EditTrackModal'
import { Track } from '../../types'

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
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)
  const [allGenres, setAllGenres] = useState<string[]>([])

  const fetchTracks = async () => {
    try {
      setLoading(true)
      const params = { page, limit, sort, order, search, genre }
      const response = await getTracks(params)
      setTracks(response.data)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error('Failed to fetch tracks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTracks()
  }, [page, limit, sort, order, search, genre])

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch('/api/genres')
        const genres = await res.json()
        setAllGenres(genres)
      } catch (error) {
        console.error('Failed to fetch genres:', error)
      }
    }

    fetchGenres()
  }, [])

  if (loading) return <div>Loading tracks...</div>

  return (
    <div data-testid="track-list">
      {tracks.map((track) => (
        <div key={track.id} className="border p-2 my-2 rounded flex justify-between items-center">
          <div>
            <div><strong>{track.title}</strong></div>
            <div>{track.artist}</div>
            <div>{track.album}</div>
          </div>
          <div>
            <button
              data-testid={`edit-button-${track.id}`}
              onClick={() => setEditingTrack(track)}
              className="text-blue-500 hover:underline"
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      {editingTrack && (
        <EditTrackModal
          isOpen={true}
          track={editingTrack}
          onClose={() => setEditingTrack(null)}
          onTrackUpdated={fetchTracks}
          allGenres={allGenres}
        />
      )}
    </div>
  )
}

export default TrackList
