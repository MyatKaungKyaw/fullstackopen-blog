const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)
const route = '/api/blogs'

beforeEach(async () => {
    Blog.deleteMany({})
    const blogs = helper.initialBlog.map(blog => new Blog(blog))
    const promiseBlogs = blogs.map(blog => blog.save())
    await Promise.all(promiseBlogs)
})

describe('blog api test', () => {
    test('specific blog is within the returned blogs', async () => {
        await api
            .get(route)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('return blog object to contain id property', async () => {
        const blogs = await api.get(route)

        blogs.body.map(blog => {
            expect(blog).toHaveProperty('id')
        })
    })

    // test('a valid blog is added',async () => {
    //     const newBlog = {
    //         title: "Canonical string reduction",
    //         author: "Edsger W. Dijkstra",
    //         url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    //         likes: 12,
    //     }

    //     const blogs = await api
    //     .post('/api/')
    // })
})

afterAll(() => {
    mongoose.connection.close()
})