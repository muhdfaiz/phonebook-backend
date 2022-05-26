const asyncHandler = require('../middleware/async')
const AuthService = require('../services/auth.service')
const { validationResult } = require('express-validator')

// @desc      Register user
// @route     POST /api/v1/auth/registration
// @access    Public
exports.register = asyncHandler(async (req, res) => {
    // Validate inputs
    const errors = validationResult(req)

    // Display errors if validation failed.
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            error: errors.array(),
        })
    }

    const inputs = req.body

    const user = await AuthService.register(inputs)

    return res.status(200).json({
        success: true,
        data: user,
    })
})

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res) => {
    // Validate inputs
    const errors = validationResult(req)

    // Display errors if validation failed.
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            error: errors.array(),
        })
    }

    const { email, password } = req.body

    const user = await AuthService.login(email, password)

    return res.status(200).json({
        success: true,
        data: user,
    })
})

// @desc      Get current logged in user
// @route     GET /api/v1/auth/user
// @access    Private
exports.authenticatedUser = asyncHandler(async (req, res) => {
    // user is already available in req due to the protect middleware
    const user = req.user

    res.status(200).json({
        success: true,
        data: user,
    })
})
