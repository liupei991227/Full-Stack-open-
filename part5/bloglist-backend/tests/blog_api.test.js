const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')


const api = supertest(app)

let token = ''

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    console.log('cleared')

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'maintest', passwordHash })
    await user.save()
    console.log('one user saved')
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'maintest', password: 'sekret' })
    token = loginResponse.body.token
    console.log('token received')

    const blogsWithUser = helper.initialBlogs.map(b => ({ ...b, user: user._id }))

    await Blog.insertMany(blogsWithUser)
})


// test('blogs are returned as json', async () => {
//     await api
//       .get('/api/blogs')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
// })


// test('all blogs are returned', async () => {
//     const response = await api.get('/api/blogs')
  
//     assert.strictEqual(response.body.length, helper.initialBlogs.length)
// })


// test('unique identifier property is named id', async () => {
//     const response = await api.get('/api/blogs')
//     const blog = response.body[0]
//     assert.ok(blog.id)
// })

  
// test('a specific title is within the returned blogs', async () => {
//     const response = await api.get('/api/blogs')
  
//     const titles = response.body.map(e => e.title)
//     assert(titles.includes('vampire'))
// })


test('a valid blog can be added ', async () => {
    const newBlog = {
        title: "890",
        author: "david",
        url: "www.swift.com",
        likes: 13,
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(titles.includes('890'))
})

test('if likes property is missing, it will default to 0', async () => {
    const newBlog = {
        title: "morning",
        author: "becca",
        url: "www.early.com",
    }
  
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
    assert.strictEqual(response.body.likes, 0)
})


test('blog without title or url is not added', async () => {
    const newBlog = {
        author: "becca"
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  
    const blogAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
})


test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  
    const titles = blogsAtEnd.map(r => r.title)
  
    assert(!titles.includes(blogToDelete.title))
})

test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
        likes: blogToUpdate.likes + 10
    }
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
})


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })


    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newBlog = {
    title: "unauthorized blog",
    author: "unknown",
    url: "www.noauth.com",
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})

