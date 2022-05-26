var Phonebook = require('../models/phonebook.model')
const ErrorResponse = require('../../../utils/errorResponse')
const filesystemConfig = require('../../../config/filesystem.config')
const excelToJson = require('convert-excel-to-json')

/**
 * Store new phonebook.
 *
 * @param {Array} inputs
 * @returns {Phonebook}
 */
exports.storeNewPhonebook = async (inputs) => {
    // Check if the phonebook already exist
    const phonebookExist = await Phonebook.findOne({
        user: inputs.user,
        $or: [{ email: inputs.email }, { mobile_number: inputs.mobile_number }],
    })

    // If phonebook already exist, throw an error
    if (phonebookExist) {
        throw new ErrorResponse(`Phonebook already exist.`, 409)
    }

    // Store new phonebook
    return await Phonebook.create(inputs)
}

/**
 * Update phonebook.
 *
 * @param {string} id
 * @param {string} userID
 * @param {Array} inputs
 * @returns {Phonebook}
 */
exports.updatePhonebook = async (id, userID, inputs) => {
    let phonebook = await Phonebook.findById(id)

    // Check id of phonebook valid or not
    if (!phonebook) {
        throw new ErrorResponse(
            `The phonebook you want to update not exist`,
            404
        )
    }

    // Checking if the new email or mobile number enter by user already exist or not.
    const newPhoneBookExist = await Phonebook.findOne({
        _id: { $ne: id },
        user: userID,
        $or: [{ email: inputs.email }, { mobile_number: inputs.mobile_number }],
    })

    if (newPhoneBookExist) {
        throw new ErrorResponse(
            `The email or mobile number you want to update already exist.`,
            404
        )
    }
    // Make sure user is phonebook owner
    if (phonebook.user.toString() !== userID) {
        throw new ErrorResponse(
            `The phonebook you want to update belongs to other user.`,
            401
        )
    }

    // Update phonebook
    return await Phonebook.findByIdAndUpdate(id, inputs, {
        new: true,
        runValidators: true,
    })
}

/**
 * Delete phonebook.
 *
 * @param {string} id
 * @param {string} userID
 * @returns {Phonebook}
 */
exports.deletePhonebook = async (id, userID) => {
    let phonebook = await Phonebook.findById(id)

    if (!phonebook) {
        throw new ErrorResponse(`Phonebook not found`, 404)
    }

    // Make sure user is phonebook owner
    if (phonebook.user.toString() !== userID) {
        throw new ErrorResponse(
            `The phonebook you want to update belongs to other user.`,
            401
        )
    }

    await phonebook.remove()
}

exports.uploadPhonebook = async (file, userID) => {
    await this.validateExcelFile(file)

    // Read the excel file and return the result in JSON.
    const phonebookJson = excelToJson({
        sourceFile: file.path,
        columnToKey: {
            A: 'name',
            B: 'email',
            C: 'mobile_number',
        },
    })

    // Iterate phonebook JSON to insert into database.
    Object.values(phonebookJson)[0].map((phonebook, index) => {
        if (index > 0) {
            const query = {
                user: userID,
                $or: [
                    { email: phonebook.email },
                    { mobile_number: phonebook.mobile_number },
                ],
            }

            // Insert or update the phonebook record.
            Phonebook.findOneAndUpdate(
                query,
                phonebook,
                { upsert: true },
                function (err) {
                    if (err) {
                        console.log(err)
                        throw new ErrorResponse(
                            `Failed to upload the phonebook excel file`,
                            400
                        )
                    }
                }
            )
        }
    })
}

/**
 *
 * Find phonebook by ID and user ID.
 *
 * @param {string} phonebookID
 * @param {string} userID
 * @returns {Phonebook}
 */
exports.findPhonebook = async (phonebookID, userID) => {
    // Check if the phonebook already exist
    const phonebook = await Phonebook.findOne({
        _id: phonebookID,
        user: userID,
    })

    // If phonebook already exist, throw an error
    if (!phonebook) {
        throw new ErrorResponse(
            `Phonebook with ID ${phonebookID} not exist.`,
            404
        )
    }

    return phonebook
}

/**
 * Get phonebooks and return in data in pagination.
 * Able to search by name, email and mobile number.
 *
 * @param {string} userID
 * @param {number} page
 * @param {number} limit
 * @param {string} search
 * @returns
 */
exports.getPhonebooks = async (userID, page, limit, search) => {
    let query = {
        user: userID,
    }

    if (search) {
        query.$or = [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
            { mobile_number: new RegExp(search, 'i') },
        ]
    }

    return Phonebook.paginate(query, { page: page, limit: limit })
        .then((result) => {
            const phonebooks = result.docs
            delete result.docs

            let paginationData = result
            return { metadata: paginationData, phonebooks: phonebooks }
        })
        .catch(() => {
            throw new ErrorResponse(`The Server Encountered an Error`, 500)
        })
}

/**
 * Validate excel file
 *
 * @param {*} file
 */
exports.validateExcelFile = async (file) => {
    if (!file) {
        throw new ErrorResponse(
            `Please select the phonebook excel file you want to upload`,
            400
        )
    }

    // Make sure the file is excel file (xlsx format)
    if (
        file.mimetype !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
        throw new ErrorResponse(
            `The file you want to upload must be an excel file`,
            400
        )
    }

    // Check filesize
    if (file.size > filesystemConfig.MAX_UPLOAD_FILE_SIZE) {
        throw new ErrorResponse(
            `Please upload file less than ${filesystemConfig.MAX_UPLOAD_FILE_SIZE} bytes`,
            400
        )
    }
}
