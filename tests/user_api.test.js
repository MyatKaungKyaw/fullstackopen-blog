const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcryptjs')
const app = require('../app')

const api = supertest(app)

describe('when there is user data in database',() =>{
    beforeEach(async () =>{
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret',10)
        const user = new User({
            username: 'root',
            name: 'origin root',
            password: passwordHash
        })

        await user.save()
    })

    test('creation success with new user name',async () => {
        const usersAtStart = await helper.usersInDb()
        const passwordHash = await bcrypt.hash('robin',10)
        const newUser = new User({
            username: 'robin',
            name: 'robin hood',
            password: passwordHash
        })

        await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type',/application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length+1)
        
        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fail with existing username with status code 400',async () => {
        const usersAtStart = await helper.usersInDb()
        const passwordHash = await bcrypt.hash('sEcret',10)
        const newUser = new User({
            username: usersAtStart[0].username,
        })
    })
})

afterAll(() => {
  mongoose.connection.close()
})