import { useState } from 'react'
import { Track } from '../types'

const initialTrack: Track = {
  id: '',
  title: '',
  artist: '',
  album: '',
  genre: [],
  audioFile: '',
  coverImage: '',
}

type Props = {
  onSubmit: (track: Track) => void
}

const TrackForm = ({ onSubmit }: Props) => {
  const [track, setTrack] = useState<Track>(initialTrack)
  const [errors, setErrors] = useState({
    title: false,
    artist: false,
    genre: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTrack((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenres = Array.from(e.target.selectedOptions).map((opt) => opt.value)
    setTrack((prev) => ({ ...prev, genre: selectedGenres }))
  }

  const validate = () => {
    const hasErrors = {
      title: track.title.trim() === '',
      artist: track.artist.trim() === '',
      genre: track.genre.length === 0,
    }
    setErrors(hasErrors)
    return !hasErrors.title && !hasErrors.artist && !hasErrors.genre
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(track)
  }

  return (
    <form onSubmit={handleSubmit} data-testid="track-form">
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={track.title}
          onChange={handleChange}
          data-testid="input-title"
        />
        {errors.title && <span data-testid="error-title">Title is required</span>}
      </div>

      <div>
        <label htmlFor="artist">Artist</label>
        <input
          id="artist"
          name="artist"
          value={track.artist}
          onChange={handleChange}
          data-testid="input-artist"
        />
        {errors.artist && <span data-testid="error-artist">Artist is required</span>}
      </div>

      <div>
        <label htmlFor="genre">Genre</label>
        <select
          multiple
          id="genre"
          value={track.genre}
          onChange={handleGenreChange}
          data-testid="genre-selector"
        >
          <option value="rock">Rock</option>
          <option value="pop">Pop</option>
          <option value="jazz">Jazz</option>
        </select>
        {errors.genre && <span data-testid="error-genre">Select at least one genre</span>}
      </div>

      <button type="submit" data-testid="submit-button">Submit</button>
    </form>
  )
}

export default TrackForm
