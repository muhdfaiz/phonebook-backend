const mongoose = require('mongoose')
const dbConfig = require('../config/database.config')

/**
 * Initialize database connection
 */
const initializeDatabaseConnection = () => {
    mongoose
        .connect(
            `mongodb://${dbConfig.DB_HOST}:${dbConfig.DB_PORT}/${dbConfig.DB_NAME}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        .then(() => {
            mongoose.set('debug', true)
            console.log('MongoDB connection established.')
        })
        .catch((error) =>
            console.error('MongoDB connection failed:', error.message)
        )
}

module.exports = initializeDatabaseConnection
