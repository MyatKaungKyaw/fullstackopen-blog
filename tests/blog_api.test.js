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

describe('blog api test', () => {
    test('specific blog is within the returned blogs', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('return blog object to contain id property', async () => {
        const blogs = await api.get('/api/blogs')

        blogs.body.map(blog => {
            expect(blog).toHaveProperty('id')
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})