const asyncHandler = require('../middleware/async')
const { validationResult } = require('express-validator')
const PhonebookService = require('../services/phonebook.service')

// @desc      Get all phonebooks
// @route     GET /api/v1/phonebooks
// @access    Private
exports.getPhonebooks = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query

    const { metadata, phonebooks } = await PhonebookService.getPhonebooks(
        req.user.id,
        page,
        limit,
        search
    )

    res.status(200).json({
        success: true,
        data: phonebooks,
        meta: metadata,
    })
})

// @desc      Get single phonebook
// @route     GET /api/v1/phonebooks/:id
// @access    Private
exports.showPhonebook = asyncHandler(async (req, res) => {
    const phonebook = await PhonebookService.findPhonebook(
        req.params.id,
        req.user.id
    )

    res.status(200).json({ success: true, data: phonebook })
})

// @desc      Create new phonebook
// @route     POST /api/v1/phonebooks
// @access    Private
exports.storePhonebook = asyncHandler(async (req, res) => {
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

    // Add user to inputs
    inputs.user = req.user.id

    const phonebook = await PhonebookService.storeNewPhonebook(inputs)

    res.status(200).json({
        success: true,
        data: phonebook,
    })
})

// @desc      Update phonebook
// @route     PUT /api/v1/phonebooks/:id
// @access    Private
exports.updatePhonebook = asyncHandler(async (req, res) => {
    // Validate inputs
    const errors = validationResult(req)

    // Display errors if validation failed.
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            error: errors.array(),
        })
    }

    const phonebook = await PhonebookService.updatePhonebook(
        req.params.id,
        req.user.id,
        req.body
    )

    res.status(200).json({ success: true, data: phonebook })
})

// @desc      Delete phonebook
// @route     DELETE /api/v1/phonebooks/:id
// @access    Private
exports.deletePhonebook = asyncHandler(async (req, res) => {
    await PhonebookService.deletePhonebook(req.params.id, req.user.id)

    res.status(201).json({ success: true, data: {} })
})

// @desc      Upload phonebook via excel file
// @route     POST /api/v1/phonebooks/excel
// @access    Private
exports.uploadPhonebook = asyncHandler(async (req, res) => {
    await PhonebookService.uploadPhonebook(req.file, req.user.id)

    res.status(200).json({
        success: true,
        data: {},
    })
})
