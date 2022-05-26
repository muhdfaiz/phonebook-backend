const loginSchema = {
    email: {
        notEmpty: {
            errorMessage: 'Email is required.',
            bail: true,
        },
        isEmail: {
            errorMessage: 'Email must be a valid email address.',
        },
    },
    password: {
        notEmpty: {
            errorMessage: 'Password is required.',
        },
    },
}

module.exports = loginSchema
