import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { appMeta } from '../app-meta'
import { Home } from './home'

// Proof-of-life smoke test for the empty shell: it renders the wordmark from
// app-meta and a link into the docs viewer. Replaced with real behavior tests
// once the extend flow exists.
test('renders the app wordmark and a docs link', () => {
  render(<Home />)

  expect(
    screen.getByRole('heading', { name: new RegExp(appMeta.name, 'i') }),
  ).toBeTruthy()
  expect(screen.getByRole('link', { name: /plan/i })).toBeTruthy()
})
