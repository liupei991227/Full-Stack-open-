const express = require('express')
const mongoose = require('mongoose')


const url = `mongodb+srv://fullstack:Huangjie926.@cluster0.kfrawjo.mongodb.net/testBlogApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)


const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
    title: "2uhjklwd",
    author: "wufcsbhdk",
    url: "www.niniwe2e.com",
    likes: 10,
})


blog.save().then(result => {
    console.log('blog saved!')
    mongoose.connection.close()
})


// Blog.find({}).then(result => {
//     result.forEach(blog => {
//       console.log(blog)
//     })
//     mongoose.connection.close()
// })

