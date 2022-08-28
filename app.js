require('dotenv').config()
const logger = require('./utils/logger')
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MONGODB.')
    })
    .catch(err => {
        logger.error('Error while connection to MONGODB.',err)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs',blogRouter)

module.exports = app