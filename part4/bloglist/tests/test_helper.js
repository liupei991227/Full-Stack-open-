const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
    {
      title: "witchs",
      author: "melissa",
      url: "www.specials.com",
      likes: 10,

    },
    {
      title: "vampire",
      author: "lucifer",
      url: "www.nima.com",
      likes: 2,

    },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}
  






module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}