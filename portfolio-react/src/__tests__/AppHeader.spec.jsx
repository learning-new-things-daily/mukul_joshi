import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'
import { MemoryRouter } from 'react-router-dom'

function renderApp(){
  return render(
    <MemoryRouter initialEntries={["/blog"]}>
      <App />
    </MemoryRouter>
  )
}

describe('Header navigation', () => {
  test('shows primary links and More button', () => {
    renderApp()
    expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /projects/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /blog/i }).length).toBeGreaterThanOrEqual(1)
    // More button is the hamburger with aria-label
    const moreBtn = screen.getByRole('button', { name: /open more pages/i })
    expect(moreBtn).toBeInTheDocument()
  })

  test('opens and closes More dropdown via click and ESC', async () => {
    const user = userEvent.setup()
    renderApp()
    const moreBtn = screen.getByRole('button', { name: /open more pages/i })
    await user.click(moreBtn)

    // dropdown appears with menu role and items
    const menu = await screen.findByRole('menu')
    expect(menu).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /designs/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /iac/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /runbooks/i })).toBeInTheDocument()

    // Press ESC to close
    await user.keyboard('{Escape}')
    expect(menu).not.toBeInTheDocument()
  })

  test('closes More dropdown on item click', async () => {
    const user = userEvent.setup()
    renderApp()
    const moreBtn = screen.getByRole('button', { name: /open more pages/i })
    await user.click(moreBtn)
    await user.click(await screen.findByRole('menuitem', { name: /security/i }))
    // Menu should close after selecting
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  test('closes on outside click', async () => {
    const user = userEvent.setup()
    renderApp()
    const moreBtn = screen.getByRole('button', { name: /open more pages/i })
    await user.click(moreBtn)
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    // Click outside: choose the first instance of the site title
    const titles = screen.getAllByText(/Mukul Joshi/i)
    await user.click(titles[0])
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
