const usersRouter = require('mongoose').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body

    const saltRounds = 10
    const passwordHash = bcrypt.hash(password, saltRounds)

    const user = new User({
        username: username,
        name: name,
        password: passwordHash
    })
    
    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = usersRouter