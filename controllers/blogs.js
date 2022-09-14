const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body=request.body
    if(!body.title || !body.url) {
        return response.status(400).end()
    }

    const blog = new Blog({
        title:body.title,
        author:body.author,
        url:body.url,
        likes:body.likes || 0,
    })

    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id',async (request,response) => {
    const id = request.params.id
    await Blog.findbyIdAndDelete(id)
})

module.exports = blogsRouter