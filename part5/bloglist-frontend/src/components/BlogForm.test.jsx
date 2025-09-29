import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls event handler with correct details when new blog is created', async () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  const titleInput = screen.getByRole('textbox', { name: /title/i })
  const authorInput = screen.getByRole('textbox', { name: /author/i })
  const urlInput = screen.getByRole('textbox', { name: /url/i })
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Testing React')
  await user.type(authorInput, 'lpp')
  await user.type(urlInput, 'http://test.com')
  await user.click(createButton)


  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing React',
    author: 'lpp',
    url: 'http://test.com'
  })
})
