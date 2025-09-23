const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async(request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//       return authorization.replace('Bearer ', '')
//     }
//     return null
// }

blogsRouter.post('/', middleware.userExtractor, async(request, response, next) => {
    try{
        const body = request.body
        const user = request.user
        if (!user) return res.status(401).json({ error: 'token missing or invalid' })

        // const decodedToken = jwt.verify(request.token, process.env.SECRET)
        // if (!decodedToken.id) {
        //   return response.status(401).json({ error: 'token invalid' })
        // }
        // const user = await User.findById(decodedToken.id)

        // if (!user) {
        //     return response.status(400).json({ error: 'userId missing or not valid' })
        // }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0,
            user: user._id
        })

        if (!blog.title || !blog.url) {
            return response.status(400).end()
        }

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)

    }catch(error){
        next(error)
    }

})

blogsRouter.delete('/:id', middleware.userExtractor, async(request, response, next) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).end()
    }

    if (blog.user.toString() !== user._id.toString()) {
        return response.status(401).json({ error: 'only the creator can delete a blog' })
    } 


    await blog.deleteOne()
    response.status(204).end()

})

blogsRouter.put('/:id', async(request, response, next) => {
    const {title, author, url, likes} = request.body

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        response.status(404).end()
    }

    if (title !== undefined) blog.title = title
    if (author !== undefined) blog.author = author
    if (url !== undefined) blog.url = url
    if (likes !== undefined) blog.likes = likes
    const updatedBlog = await blog.save()
    response.json(updatedBlog)
})



module.exports = blogsRouter







