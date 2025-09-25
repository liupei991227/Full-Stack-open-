const http = require('http')

const app = require('./app') 
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})





// const http = require('http')
// const express = require('express')
// const mongoose = require('mongoose')

// const app = express()



// const blogSchema = mongoose.Schema({
//   title: String,
//   author: String,
//   url: String,
//   likes: Number,
// })

// const Blog = mongoose.model('Blog', blogSchema, 'blogs') 


// mongoose.set('strictQuery', false)
// mongoose.connect(mongoUrl)

// mongoose.connection.on('connected', () => {
//     console.log('Mongoose connected to DB')
// })

//   mongoose.connection.on('error', (err) => {
//     console.error('Mongoose connection error:', err)
// })

// app.use(express.json())

// app.get('/api/blogs', (request, response) => {
//     Blog.find({}).then((blogs) => {
//       response.json(blogs)
//     })
// })


// app.post('/api/blogs', (request, response) => {
//   const blog = new Blog(request.body)

//   blog.save().then((result) => {
//     response.status(201).json(result)
//   })
// })




// const PORT = 3003
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })


