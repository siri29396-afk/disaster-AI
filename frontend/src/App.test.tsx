import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { disasters, guides } from './data'

vi.mock('./storage', () => ({
  deleteContact: vi.fn(),
  deletePlan: vi.fn(),
  getContacts: vi.fn(async () => []),
  getPlans: vi.fn(async () => []),
  getSetting: vi.fn(async (_key: string, fallback: unknown) => fallback),
  saveContact: vi.fn(),
  savePlan: vi.fn(),
  saveSetting: vi.fn(),
}))

describe('DisasterAI frontend', () => {
  beforeEach(() => {
    cleanup()
    window.history.replaceState({}, '', '/')
  })

  it('bundles safety guides for all supported hazards', () => {
    expect(disasters).toHaveLength(9)
    expect(guides.tsunami.during).toContain('Follow official evacuation instructions immediately.')
    expect(guides.flood.source).toMatch(/^https:\/\//)
  })

  it('renders the dashboard and changes navigation language', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Preparedness overview' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'Hindi' } })
    expect(screen.getAllByText('अवलोकन')).toHaveLength(2)
  })

  it('shows localized offline safety instructions', () => {
    render(<App />)
    fireEvent.click(screen.getAllByRole('link', { name: 'Safety guides' })[0])
    fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'Telugu' } })
    expect(screen.getAllByText('వరద')).toHaveLength(2)
    expect(screen.getByText('వరద నీటిలో నడవకండి లేదా వాహనం నడపకండి.')).toBeInTheDocument()
  })
})