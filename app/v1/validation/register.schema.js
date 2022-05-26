const registerSchema = {
    name: {
        notEmpty: {
            errorMessage: 'Name is required.',
            bail: true,
        },
        trim: true,
    },
    email: {
        notEmpty: {
            errorMessage: 'Email is required.',
            bail: true,
        },
        isEmail: {
            errorMessage: 'Email must be a valid email address.',
        },
        trim: true,
    },
    password: {
        notEmpty: {
            errorMessage: 'Password is required.',
        },
        isLength: {
            errorMessage: 'Password must be at least 10 characters.',
            options: { min: 10 },
        },
        trim: true,
    },
}

module.exports = registerSchema
