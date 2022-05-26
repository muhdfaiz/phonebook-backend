const { validationResult } = require('express-validator')

const displayValidationErrors = (req, res) => {
    // Validate inputs
    const errors = validationResult(req)

    // Display errors if validation failed.
    if (!errors.isEmpty()) {
        res.status(422).json({
            success: false,
            error: errors.array(),
        })
    }
}

module.exports = displayValidationErrors
