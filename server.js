require('dotenv').config()
require('colors')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const errorHandler = require('./app/v1/middleware/error')
const appConfig = require('./config/app.config')
const v1Auth = require('./app/v1/routes/auth.route')
const v1Phonebook = require('./app/v1/routes/phonebook.route')
const initializeDatabaseConnection = require('./system/database')
const mongoSanitize = require('express-mongo-sanitize')
const corsConfig = require('./config/cors.config')

// Initialize express
const app = express()

// Connect to database
initializeDatabaseConnection()

// adding Helmet to enhance API's security
app.use(helmet())

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(mongoSanitize())

// Enable cors
app.use(
    cors({
        origin: corsConfig.ALLOWED_ORIGIN,
        methods: corsConfig.ALLOWED_METHODS,
    })
)

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
})

app.use(limiter)

app.use(compression())

// Log request using morgan
if (appConfig.APP_ENV === 'development') {
    app.use(morgan('combined'))
}

app.use('/api/v1/auth', v1Auth)
app.use('/api/v1/phonebooks', v1Phonebook)
app.use(errorHandler)

app.listen(appConfig.APP_PORT, () => {
    console.log(
        `API running in ${appConfig.APP_ENV} mode is listening on port ${appConfig.APP_PORT}`
            .green.bold
    )
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`.red.bold)
})
