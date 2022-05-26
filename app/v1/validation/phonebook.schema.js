const PhonebookSchema = {
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
    mobile_number: {
        notEmpty: {
            errorMessage: 'Mobile number is required.',
        },
        matches: {
            options: /^(01)[0-46-9]*[0-9]{7,8}$/,
            errorMessage: 'Mobile number must be a valid format',
        },
        trim: true,
    },
}

module.exports = PhonebookSchema
