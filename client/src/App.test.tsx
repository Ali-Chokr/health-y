import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { router } from './router'
import { AppProviders } from './components/providers/AppProviders'
import { AuthProvider } from './components/providers/AuthProvider'

describe('App', () => {
  it('renders with router and providers', async () => {
    // Create a test router instance to control the initial route
    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/'],
    })

    render(
      <AppProviders>
        <AuthProvider>
          <RouterProvider router={testRouter} />
        </AuthProvider>
      </AppProviders>,
    )

    // Wait for the heading to appear (may take a moment for auth state to settle)
    const heading = await screen.findByRole('heading', { name: /welcome/i })
    expect(heading).toBeInTheDocument()
  })
})

