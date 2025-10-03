import { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import Notification from './components/Notification'
import LoginForm from './components/Loginform'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import { useDispatch, useSelector } from 'react-redux'
import { showNotification } from './store/slices/notificationSlice'

import { initializeBlogs, createBlog, likeBlog, removeBlog } from './store/slices/blogsSlice'
import { setUser, clearUser } from './store/slices/userSlice'


const App = () => {
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  // 从 Redux 中拿数据
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const notification = useSelector(state => state.notification)

  // 初始化博客
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  // 检查 localStorage 里是否有登录信息
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async (event, username, password) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(showNotification('login successful', 'success', 5))
    } catch (exception) {
      dispatch(showNotification('wrong username or password', 'error', 5))
    }
  }

  const addBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()
    const newBlog = await blogService.create(blogObject)
    dispatch(createBlog(newBlog))
    dispatch(
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'success', 5)
    )
  }

  const handleLike = async blog => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user?.id }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    dispatch(likeBlog(returnedBlog))
  }

  const handleRemove = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      dispatch(removeBlog(blog.id))
      dispatch(showNotification(`Deleted ${blog.title} by ${blog.author}`, 'success', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification.message} type={notification.type} />
        <h2>Log in to application</h2>
        <Togglable buttonLabel="log in">
          <LoginForm handleSubmit={handleLogin} />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>

      <h2>create new</h2>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={handleLike}
            removeBlog={handleRemove}
            user={user}
          />
        ))}
    </div>
  )
}

export default App








// const App = () => {
//   const dispatch = useDispatch()
//   const blogs = useSelector(state => state.blogs)
//   const user = useSelector(state => state.user)

//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const blogFormRef = useRef()


//   useEffect(() => {
//     dispatch(restoreUserFromLocalStorage())
//     dispatch(initializeBlogs())
//   }, [dispatch])

//   const handleLogin = async event => {
//     event.preventDefault()
//     dispatch(login({ username, password }))
//     setUsername('')
//     setPassword('')
//   }

//   const handleLogout = () => {
//     dispatch(logout())
//   }

//   const addBlog = blogObject => {
//     blogFormRef.current.toggleVisibility()
//     dispatch(createBlog(blogObject))
//   }

//   const handleLike = blog => {
//     dispatch(likeBlog(blog))
//   }

//   const handleRemove = blog => {
//     if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
//       dispatch(removeBlog(blog.id))
//     }
//   }

//   const loginForm = () => (
//     <Togglable buttonLabel="log in">
//       <LoginForm
//         username={username}
//         password={password}
//         handleUsernameChange={({ target }) => setUsername(target.value)}
//         handlePasswordChange={({ target }) => setPassword(target.value)}
//         handleSubmit={handleLogin}
//       />
//     </Togglable>
//   )

//   const blogForm = () => (
//     <Togglable buttonLabel="create new blog" ref={blogFormRef}>
//       <BlogForm createBlog={addBlog} />
//     </Togglable>
//   )

//   if (!user) {
//     return (
//       <div>
//         <Notification />
//         <h2>Log in to application</h2>
//         {loginForm()}
//       </div>
//     )
//   }

//   return (
//     <div>
//       <Notification />
//       <h2>blogs</h2>
//       <p>{user.name} logged in</p>

//       <button onClick={handleLogout}>logout</button>

//       <h2>create new</h2>
//       {blogForm()}

//       {blogs
//         .slice()
//         .sort((a, b) => b.likes - a.likes)
//         .map(blog => (
//           <Blog
//             key={blog.id}
//             blog={blog}
//             likeBlog={() => handleLike(blog)}
//             removeBlog={() => handleRemove(blog)}
//             user={user}
//           />
//         ))}
//     </div>
//   )
// }

// export default App






















// const App = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [user, setUser] = useState(null);
//   // const [notification, setNotification] = useState({ message: null, type: null })

//   const blogFormRef = useRef();

//   const dispatch = useDispatch()
//   dispatch(showNotification('login successful', 'success', 5))

//   useEffect(() => {
//     blogService.getAll().then(blogs => setBlogs(blogs));
//   }, [])

//   useEffect(() => {
//     const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
//     if (loggedUserJSON) {
//       const user = JSON.parse(loggedUserJSON)
//       setUser(user)
//       blogService.setToken(user.token)
//     }
//   }, [])

//   const handleLogin = async event => {
//     event.preventDefault()
//     try {
//       const user = await loginService.login({ username, password })

//       window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

//       blogService.setToken(user.token)
//       console.log(user.token)
//       setUser(user)

//       setUsername('')
//       setPassword('')
//     } catch (exception) {
//       dispatch(showNotification('wrong username or password', 'error', 5))

//       // setNotification({ message: 'wrong username or password', type: 'error' });
//       // setTimeout(() => {
//       //   setNotification({ message: null, type: null });
//       // }, 5000);
//       console.log('wrong credentials');
//     }
//   };

//   const addBlog = blogObject => {
//     blogFormRef.current.toggleVisibility()
//     blogService.create(blogObject).then(returnedBlog => {
//       setBlogs(blogs.concat(returnedBlog))
//       dispatch(showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success', 5))
//       // setNotification({
//       //   message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
//       //   type: 'success',
//     })
//     setTimeout(() => {
//       dispatch(showNotification(null, null, 0))

//       // setNotification({ message: null, type: null });
//       // }, 5000);
//     })
//   }

//   const likeBlog = blog => {
//     const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user?.id };
//     blogService.update(blog.id, updatedBlog).then(returnedBlog => {
//       setBlogs(blogs.map(b => (b.id !== blog.id ? b : returnedBlog)));
//     })
//   };

//   const removeBlog = blog => {
//     if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
//       blogService.remove(blog.id).then(() => {
//         setBlogs(blogs.filter(b => b.id !== blog.id))
//         dispatch(showNotification(`Deleted ${blog.title} by ${blog.author}`, 'success', 5))
//         // setNotification({ message: `Deleted ${blog.title} by ${blog.author}`, type: 'success' });
//         setTimeout(() => {
//           dispatch(showNotification(null, null, 0))
//           // setNotification({ message: null, type: null });
//         // }, 5000);
//         })
//     })
//   }}

//   const loginForm = () => (
//     <Togglable buttonLabel="log in">
//       <LoginForm
//         username={username}
//         password={password}
//         handleUsernameChange={({ target }) => setUsername(target.value)}
//         handlePasswordChange={({ target }) => setPassword(target.value)}
//         handleSubmit={handleLogin}
//       />
//     </Togglable>
//   );

//   const blogForm = () => (
//     <Togglable buttonLabel="create new blog" ref={blogFormRef}>
//       <BlogForm createBlog={addBlog} />
//     </Togglable>
//   );

//   if (user === null) {
//     return (
//       <div>
//         <Notification message={notification.message} type={notification.type} />
//         <h2>Log in to application</h2>
//         {loginForm()}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Notification message={notification.message} type={notification.type} />
//       <h2>blogs</h2>
//       <p>{user.name} logged in</p>

//       <button
//         onClick={() => {
//           window.localStorage.removeItem('loggedBlogAppUser');
//           setUser(null);
//         }}
//       >
//         logout
//       </button>

//       <h2>create new</h2>
//       {blogForm()}
//       {blogs
//         .sort((a, b) => b.likes - a.likes)
//         .map(blog => (
//           <Blog key={blog.id} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} user={user} />
//         ))}

//       {/* {blogs.map(blog => <Blog key={blog.id} blog={blog} />)} */}
//     </div>
//   )
// }

// export default App
