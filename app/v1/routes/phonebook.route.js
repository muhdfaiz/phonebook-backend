const express = require('express')
const { checkSchema } = require('express-validator')
const {
    getPhonebooks,
    storePhonebook,
    updatePhonebook,
    deletePhonebook,
    uploadPhonebook,
    showPhonebook,
} = require('../controllers/phonebook.controller')
const { auth } = require('../middleware/auth')
const PhonebookSchema = require('../validation/phonebook.schema')
const multer = require('multer')
const os = require('os')
const filesystemConfig = require('../../../config/filesystem.config')
const upload = multer(
    { dest: os.tmpdir() },
    { limits: { fieldSize: filesystemConfig.MAX_UPLOAD_FILE_SIZE } }
)
const router = express.Router()

router
    .route('/')
    .get(auth, getPhonebooks)
    .post(auth, upload.none(), checkSchema(PhonebookSchema), storePhonebook)

router
    .route('/:id')
    .get(auth, showPhonebook)
    .put(auth, upload.none(), checkSchema(PhonebookSchema), updatePhonebook)
    .delete(auth, deletePhonebook)

router.route('/excel').post(auth, upload.single('excel'), uploadPhonebook)

module.exports = router
