import React from 'react';
//addBlog, newTitle, setNewTitle, newAuthor, setNewAuthor, newUrl, setNewUrl

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = React.useState('');
  const [newAuthor, setNewAuthor] = React.useState('');
  const [newUrl, setNewUrl] = React.useState('');

  const addBlog = event => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    setNewTitle('');
    setNewAuthor('');
    setNewUrl('');
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title
          <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} />
        </label>
      </div>
      <div>
        <label>
          author <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
        </label>
      </div>
      <div>
        <label>
          url <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
