const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if(authorization && authorization.tolowerCase().startsWith('bearer ')){
        return authorization.subString(7)
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user',{username:1,name:1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    if (!body.title || !body.url) {
        return response.status(400).end()
    }

    const token = getTokenFrom(request)
    const decodeToken = jwt.verify(token,process.env.SECRET)

    if(!decodeToken.id){
        res.status(401).json({error:'token missing or invalid'})
    }
    const user = await User.findById(decodeToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id,
    })

    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
  
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }
    const updBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.status(201).json(updBlog)
})

module.exports = blogsRouter