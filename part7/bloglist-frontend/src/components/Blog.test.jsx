import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  };

  render(<Blog blog={blog} />);

  screen.debug();

  const element = screen.getByText('React patterns Michael Chan');
  expect(element).toBeDefined();

  const url = screen.queryByText('https://reactpatterns.com/');
  const likes = screen.queryByText('likes 7');

  expect(url).toBeNull();
  expect(likes).toBeNull();
});

test('shows url and likes when view button is clicked', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  };

  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  expect(screen.getByText('https://reactpatterns.com/')).toBeDefined();
  expect(screen.getByText('likes 7')).toBeDefined();
});

test('if like button is clicked twice, event handler is called twice', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} likeBlog={mockHandler} />);

  const user = userEvent.setup();
  const viewButton = screen.getByText('view');
  await user.click(viewButton);

  const likeButton = screen.getByText('like');
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
