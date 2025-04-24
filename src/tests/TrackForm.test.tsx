import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import TrackForm from '../components/TrackForm'

describe('TrackForm validation', () => {
  test('показывает ошибки только после сабмита', () => {
    render(<TrackForm onSubmit={vi.fn()} />)

    expect(screen.queryByTestId('error-title')).toBeNull()
    expect(screen.queryByTestId('error-artist')).toBeNull()
    expect(screen.queryByTestId('error-genre')).toBeNull()

    fireEvent.click(screen.getByTestId('submit-button'))

    expect(screen.getByTestId('error-title')).toBeInTheDocument()
    expect(screen.getByTestId('error-artist')).toBeInTheDocument()
    expect(screen.getByTestId('error-genre')).toBeInTheDocument()
  })

  test('ошибки исчезают после заполнения и сабмита', () => {
    const handleSubmit = vi.fn()
    render(<TrackForm onSubmit={handleSubmit} />)

    fireEvent.click(screen.getByTestId('submit-button'))

    fireEvent.change(screen.getByTestId('input-title'), {
      target: { value: 'Test Track' },
    })
    fireEvent.change(screen.getByTestId('input-artist'), {
      target: { value: 'Test Artist' },
    })
    fireEvent.change(screen.getByTestId('genre-selector'), {
      target: { value: 'rock' },
    })

    fireEvent.click(screen.getByTestId('submit-button'))

    expect(screen.queryByTestId('error-title')).toBeNull()
    expect(screen.queryByTestId('error-artist')).toBeNull()
    expect(screen.queryByTestId('error-genre')).toBeNull()

    expect(handleSubmit).toHaveBeenCalled()
  })
})
