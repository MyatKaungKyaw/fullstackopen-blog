const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
    Blog.deleteMany({})
    const blogs = helper.initialBlog.map(blog => new Blog(blog))
    const promiseBlogs = blogs.map(blog => blog.save())
    await Promise.all(promiseBlogs)
})

test('specific blog is within the returned blogs',() => {
    api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type',/application\/json/)
})

afterAll(() =>{
    mongoose.connection.close()
})