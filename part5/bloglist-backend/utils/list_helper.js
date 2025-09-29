const dummy = (blogs) => {
    return 1
}


const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav), blogs[0])
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const authorCounts = {}
    blogs.forEach(blog => {
        authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
    })
    const maxAuthor = Object.keys(authorCounts).reduce((max, author) => 
        authorCounts[author] > authorCounts[max] ? author : max, Object.keys(authorCounts)[0])
    
    return { author: maxAuthor, blogs: authorCounts[maxAuthor] }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const authorLikes = {}
    blogs.forEach(blog => {
        authorLikes[blog.author] = (authorLikes[blog.author] || 0) + (blog.likes || 0)
    })
    const maxAuthor = Object.keys(authorLikes).reduce((max, author) => 
        authorLikes[author] > authorLikes[max] ? author : max, Object.keys(authorLikes)[0])
    
    return { author: maxAuthor, likes: authorLikes[maxAuthor] }
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}

