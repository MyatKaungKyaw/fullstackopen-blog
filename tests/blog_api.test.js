const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)
const endPoint = '/api/blogs'

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogs = helper.initialBlog.map(blog => new Blog(blog))
    const promiseBlogs = blogs.map(blog => blog.save())
    await Promise.all(promiseBlogs)
})

describe('blog api test', () => {
    test('specific blog is within the returned blogs', async () => {
        await api
            .get(endPoint)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('return blog object to contain id property', async () => {
        const blogs = await api.get(endPoint)

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
            .post(endPoint)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await api.get(endPoint)
        const titles = blogs.body.map(blog => blog.title)

        expect(blogs.body).toHaveLength(helper.initialBlog.length + 1)
        expect(titles).toContain('Canonical string reduction')
    })

    test('blog with no like property request is default to 0 value', async () => {
        const blogWitNoLike = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        }

        await api
            .post(endPoint)
            .send(blogWitNoLike)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await api.get(endPoint)
        const blog = blogs.body.find(blog => blog.title === 'Canonical string reduction')
        expect(blog.likes).toEqual(0)
    })

    test('blog with no title is not added', async () => {
        const blogWitNoTitle = {
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes:5,
        }

        await api
        .post(endPoint)
        .send(blogWitNoTitle)
        .expect(400)
    })

    
    test('blog with no url is not added', async () => {
        const blogWitNoURL = {
            title: "useId Hook Explained",
            author: "Ahsan Ali Mansoor",
            likes: 4,
        }

        await api
        .post(endPoint)
        .send(blogWitNoURL)
        .expect(400)

    })
})

afterAll(() => {
    mongoose.connection.close()
})