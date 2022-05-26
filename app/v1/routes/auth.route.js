const express = require('express')
const { checkSchema } = require('express-validator')
const multer = require('multer')
const upload = multer()
const {
    register,
    login,
    authenticatedUser,
} = require('../controllers/auth.controller')

const loginSchema = require('../validation/login.schema')
const registerSchema = require('../validation/register.schema')

const router = express.Router()

const { auth } = require('../middleware/auth')

router.post(
    '/registration',
    upload.none(),
    checkSchema(registerSchema),
    register
)
router.post('/login', upload.none(), checkSchema(loginSchema), login)
router.get('/user', auth, authenticatedUser)

module.exports = router
