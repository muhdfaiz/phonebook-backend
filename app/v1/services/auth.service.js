var User = require('../models/user.model')
const ErrorResponse = require('../../../utils/errorResponse')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const authConfig = require('../../../config/auth.config')

/**
 * Register new user and generate access token.
 *
 * @param {*} inputs
 * @returns {User}
 */
exports.register = async (inputs) => {
    const { email } = inputs

    // Check email already exist or not.
    const userAlreadyExist = await User.findOne({ email }).select('email')

    if (userAlreadyExist) {
        throw new ErrorResponse('Email already exist.', 409)
    }

    // Create user
    const user = await User.create(inputs)

    const { ...newUser } = user._doc
    delete newUser.password

    // Generate JWT access token
    newUser.access_token = jwt.sign(
        { id: newUser._id },
        authConfig.JWT_SECRET,
        {
            expiresIn: authConfig.JWT_EXPIRE,
        }
    )

    return newUser
}

exports.login = async (email, password) => {
    // Check for user
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        throw new ErrorResponse('Invalid credentials', 401)
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new ErrorResponse('Invalid credentials', 401)
    }

    const { ...authenticatedUser } = user._doc
    delete authenticatedUser.password

    // Generate JWT access token
    authenticatedUser.access_token = jwt.sign(
        { id: authenticatedUser._id },
        authConfig.JWT_SECRET,
        {
            expiresIn: authConfig.JWT_EXPIRE,
        }
    )

    return authenticatedUser
}
