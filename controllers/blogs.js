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

blogsRouter.pug('/:id',async (request,response) => {
  const id = request.params.id
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  const updBlog = await Blog.findByIdAndUpdate(id,blog,{new:true})
  response.status(204).json(updBlog)
})

module.exports = blogsRouter