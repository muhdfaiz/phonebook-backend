module.exports = {
    /*
     * Matches the request origin. `['*']` allows all origins. Wildcards can be used, eg `*.mydomain.com`
     */
    ALLOWED_ORIGIN: [
        'http://localhost:3001/',
        'https://628f580e66f215000b86d94a--quiet-dodol-232f73.netlify.app/',
    ],

    /*
     * Matches the request method. `['*']` allows all methods.
     */
    ALLOWED_METHODS: ['*'],
}
