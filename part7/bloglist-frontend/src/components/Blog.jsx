import { useState } from 'react';

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="blogDetails">
          <div className="blogUrl">{blog.url}</div>
          <div className="blogLikes">
            likes {blog.likes} <button onClick={() => likeBlog(blog)}>like</button>
          </div>
          <div className="blogUser">{blog.user?.name}</div>
          {user && blog.user?.username === user.username && (
            <button onClick={() => removeBlog(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
