const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)
const route = '/api/blogs'

beforeEach(async () => {
    await Blog.deleteMany({})
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

    test('a valid blog is added', async () => {
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
        }

        await api
            .post(route)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type',/application\/json/)

        const blogs = await api.get(route)
        const titles = blogs.body.map(blog => blog.title)

        expect(blogs.body).toHaveLength(helper.initialBlog.length + 1)
        expect(titles).toContain('Canonical string reduction')
    })

    test('blog with no like property request is default to 0 value',async () => {
        const blogWitNoLike = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        }

        await api
            .post(route)
            .send(blogWitNoLike)
            .expect(201)
            .expect('Content-Type',/application\/json/)

        const blogs = await api.get(route)
        const blog = blogs.body.find(blog => blog.title === 'Canonical string reduction')
        console.log(blog)
        expect(blog.likes).toEqual(0)
    })
})

afterAll(() => {
    mongoose.connection.close()
})