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

describe('getting blogs',() =>{
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
})

describe('adding blog',() =>{
    // test('a valid blog is added', async () => {
    //     const newBlog = {
    //         title: "Canonical string reduction",
    //         author: "Edsger W. Dijkstra",
    //         url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    //         likes: 12,
    //     }

    //     await api
    //         .post(endPoint)
    //         .send(newBlog)
    //         .expect(201)
    //         .expect('Content-Type', /application\/json/)

    //     const blogs = await api.get(endPoint)
    //     const titles = blogs.body.map(blog => blog.title)

    //     expect(blogs.body).toHaveLength(helper.initialBlog.length + 1)
    //     expect(titles).toContain('Canonical string reduction')
    // })

    // test('blog with no like property request is default to 0 value', async () => {
    //     const blogWitNoLike = {
    //         title: "Canonical string reduction",
    //         author: "Edsger W. Dijkstra",
    //         url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    //     }

    //     await api
    //         .post(endPoint)
    //         .send(blogWitNoLike)
    //         .expect(201)
    //         .expect('Content-Type', /application\/json/)

    //     const blogs = await api.get(endPoint)
    //     const blog = blogs.body.find(blog => blog.title === 'Canonical string reduction')
    //     expect(blog.likes).toEqual(0)
    // })

    // test('blog with no title is not added', async () => {
    //     const blogWitNoTitle = {
    //         author: "Edsger W. Dijkstra",
    //         url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    //         likes:5,
    //     }

    //     await api
    //     .post(endPoint)
    //     .send(blogWitNoTitle)
    //     .expect(400)
    // })

    
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

describe('deleting blog',() => {
    // test('success with status 204 if id is valid', async () => {
    //     const blogsBeforeDelete = await helper.blogsInDb()
    //     const blogToDelete = blogsBeforeDelete[0]
    //     await api
    //     .delete(`${endPoint}/${blogsBeforeDelete[0].id}`)
    //     .expect(204)

    //     const blogsAfterDelete = await helper.blogsInDb()
    //     expect(blogsAfterDelete).toHaveLength(blogsBeforeDelete.length-1)

    //     const ids = blogsAfterDelete.map(blog => blog.id)
    //     expect(ids).not.toContain(blogToDelete.id)
    // })
})

describe('updating blog',() => {
    test('success with status 201 if id is valid', async () =>{
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        blogToUpdate.likes = 55

        await api
        .put(`${endPoint}/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(201)
        .expect('Content-Type',/application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
        expect(blogsAtEnd).toContainEqual(blogToUpdate)
    })
})

afterAll(() => {
    mongoose.connection.close()
})