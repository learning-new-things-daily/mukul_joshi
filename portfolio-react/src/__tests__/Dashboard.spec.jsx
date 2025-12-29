import { render, screen } from '@testing-library/react'
import Dashboard from '../components/Dashboard.jsx'

describe('Dashboard layout', () => {
  test('live dashboard uses 4 columns on xl screens (class present)', () => {
    const { container } = render(<Dashboard />)
    // Find the first grid that wraps metrics; rely on class name
    const grid = container.querySelector('div.grid')
    expect(grid).toBeTruthy()
    // Should include xl:grid-cols-4 in class list for wider screens
    expect(grid.className).toMatch(/xl:grid-cols-4/)
  })

  test('sparkline uses widened width', () => {
    const { container } = render(<Dashboard />)
    const svgs = Array.from(container.querySelectorAll('svg'))
    const svg = svgs.find(el => el.querySelector('polyline'))
    expect(svg).toBeTruthy()
    // Validate sparkline structure is present
    const polyline = svg.querySelector('polyline')
    expect(polyline).toBeTruthy()
    expect(polyline.getAttribute('stroke')).toBe('#0a3d62')
    expect(polyline.getAttribute('stroke-width')).toBe('2')
  })
})
