module.exports = {
    /*
     * Matches the request origin. `['*']` allows all origins. Wildcards can be used, eg `*.mydomain.com`
     */
    ALLOWED_ORIGIN: [
        'http://localhost:3001/',
        'https://phonebook-frontend.netlify.app',
    ],

    /*
     * Matches the request method. `['*']` allows all methods.
     */
    ALLOWED_METHODS: ['*'],
}
