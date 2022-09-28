const jwt = require('jasonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const user = require('../models/user')
const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body

    const user = await user.find({ username })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)

    if (!(user && passwordCorrect)) {
        return Response.status(401).json({ error: 'username or password is incorrect' })
    }

    const userForToken = {
        usrename: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    res
        .status(200)
        .send({
            token: token,
            usernmae: user.username,
            name: user.name,
        })
})

module.exports = loginRouter