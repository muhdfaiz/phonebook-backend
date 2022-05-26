const dbHandler = require('../db.handler')
const phonebookService = require('../../app/v1/services/phonebook.service')
const phonebookModel = require('../../app/v1/models/phonebook.model')
const userModel = require('../../app/v1/models/user.model')
const path = require('path')
const filesystemConfig = require('../../config/filesystem.config')
const excelToJson = require('convert-excel-to-json')
const mongoose = require('mongoose')

beforeAll(async () => await dbHandler.connect())
afterEach(async () => await dbHandler.clear())
afterAll(async () => await dbHandler.close())

describe('Store New Phonebook ', () => {
    it('should failed to create due to same email already exist', async () => {
        const user = await userModel.create({
            name: 'user1',
            email: 'user1@test.com',
            password: '123456',
        })

        await phonebookModel.create({
            name: 'contact1',
            email: 'contact1@test.com',
            mobile_number: '0121234567',
            user: user._id,
        })

        try {
            await phonebookService.storeNewPhonebook({
                name: 'contact1',
                email: 'contact1@test.com',
                mobile_number: '0121234500',
                user: user._id,
            })
        } catch (e) {
            expect(await phonebookModel.countDocuments({})).toBe(1)

            expect(e.message).toBe('Phonebook already exist.')
        }
    })
})

describe('Update Phonebook ', () => {
    it('should return an error when the phonebook you want to update not exist', async () => {
        const phonebookID = new mongoose.Types.ObjectId().toString()
        const userID = new mongoose.Types.ObjectId().toString()

        try {
            await phonebookService.updatePhonebook(phonebookID, userID, {
                name: 'contact1',
                email: 'contact1@test.com',
                mobile_number: '0121234500',
            })
        } catch (e) {
            expect(e.message).toBe('The phonebook you want to update not exist')
        }
    })

    it('should failed to create due to same mobile number already exist', async () => {
        const user = await userModel.create({
            name: 'user1',
            email: 'user1@test.com',
            password: '123456',
        })

        const phonebook1 = await phonebookModel.create({
            name: 'contact1',
            email: 'contact1@test.com',
            mobile_number: '0121234511',
            user: user._id,
        })

        const phonebook2 = await phonebookModel.create({
            name: 'contact2',
            email: 'contact2@test.com',
            mobile_number: '0121234522',
            user: user._id,
        })

        try {
            await phonebookService.updatePhonebook(
                phonebook2._id.toString(),
                user._id.toString(),
                {
                    name: 'contact1',
                    email: 'contact1@test.com',
                    mobile_number: '0121234511',
                    user: user._id,
                }
            )
        } catch (e) {
            expect(e.message).toBe(
                'The email or mobile number you want to update already exist.'
            )
        }
    })

    it('should successfully update the phonebook', async () => {
        const user = await userModel.create({
            name: 'user1',
            email: 'user1@test.com',
            password: '123456',
        })

        const phonebook = await phonebookModel.create({
            name: 'contact1',
            email: 'contact1@test.com',
            mobile_number: '0121234567',
            user: user._id,
        })

        const updateInput = {
            name: 'contact2',
            email: 'contact2@test.com',
            mobile_number: '0121111222',
        }

        await phonebookService.updatePhonebook(
            phonebook._id.toString(),
            user._id.toString(),
            updateInput
        )

        const updatedPhonebook = await phonebookModel.findById(phonebook._id)
        expect(phonebook._id.toString()).toBe(updatedPhonebook._id.toString())
        expect(updateInput.name).toBe(updatedPhonebook.name)
        expect(updateInput.email).toBe(updatedPhonebook.email)
        expect(updateInput.mobile_number).toBe(updatedPhonebook.mobile_number)
        expect(phonebook.user.toString()).toBe(updatedPhonebook.user.toString())
    })
})

describe('Delete Phonebook ', () => {
    it('should failed to delete due to owner of the phonebook is different', async () => {
        const user1 = await userModel.create({
            name: 'user1',
            email: 'user1@test.com',
            password: '123456',
        })

        const user2 = await userModel.create({
            name: 'user2',
            email: 'user2@test.com',
            password: '123456',
        })

        const phonebookToDelete = await phonebookModel.create({
            name: 'contact1',
            email: 'contact1@test.com',
            mobile_number: '0121234567',
            user: user1._id,
        })

        try {
            await phonebookService.deletePhonebook(
                phonebookToDelete._id,
                user2._id.toString()
            )
        } catch (e) {
            expect(await phonebookModel.countDocuments({})).toBe(1)

            expect(e.message).toBe(
                'The phonebook you want to update belongs to other user.'
            )
        }
    })

    it('should successfully deleted the phonebook', async () => {
        const user = await userModel.create({
            name: 'user1',
            email: 'user1@test.com',
            password: '123456',
        })

        const phonebookToDelete = await phonebookModel.create({
            name: 'contact1',
            email: 'contact1@test.com',
            mobile_number: '0121234567',
            user: user._id,
        })

        expect(await phonebookModel.countDocuments({})).toBe(1)

        await phonebookService.deletePhonebook(
            phonebookToDelete._id,
            user._id.toString()
        )

        expect(await phonebookModel.countDocuments({})).toBe(0)
    })
})

describe('Upload Excel', () => {
    it('should failed to upload due to the file not excel file', async () => {
        const user = await userModel.create({
            name: 'user1',
            email: 'user1@test.com',
            password: '123456',
        })

        const mime = require('mime-types')

        const pdfFile = {
            mimetype: mime.lookup(
                path.resolve(__dirname, '../test_file/sample.pdf')
            ),
            path: path.resolve(__dirname, '../test_file/sample.pdf'),
        }

        try {
            await phonebookService.uploadPhonebook(pdfFile, user._id)
        } catch (e) {
            console.log(e)
            expect(e.message).toBe(
                'The file you want to upload must be an excel file'
            )
        }
    })

    it('should failed to upload due to the file size more than max file size specify in config', async () => {
        const user = await userModel.create({
            name: 'user1',
            email: 'user1@test.com',
            password: '123456',
        })

        const mime = require('mime-types')

        const pdfFile = {
            mimetype: mime.lookup(
                path.resolve(__dirname, '../test_file/sample.xlsx')
            ),
            path: path.resolve(__dirname, '../test_file/sample.xlsx'),
            size: 10000000,
        }

        try {
            await phonebookService.uploadPhonebook(pdfFile, user._id)
        } catch (e) {
            expect(e.message).toBe(
                `Please upload file less than ${filesystemConfig.MAX_UPLOAD_FILE_SIZE} bytes`
            )
        }
    })

    it('should successfully import the data from excel file', async () => {
        const user = await userModel.create({
            name: 'user1',
            email: 'user1@test.com',
            password: '123456',
        })

        const mime = require('mime-types')

        const pdfFile = {
            mimetype: mime.lookup(
                path.resolve(__dirname, '../test_file/sample.xlsx')
            ),
            path: path.resolve(__dirname, '../test_file/sample.xlsx'),
            size: 100,
        }

        await phonebookService.uploadPhonebook(pdfFile, user._id)

        const phonebookJson = excelToJson({
            sourceFile: path.resolve(__dirname, '../test_file/sample.xlsx'),
            columnToKey: {
                A: 'name',
                B: 'email',
                C: 'mobile_number',
            },
        })

        const phonebooks = await phonebookModel.find({})

        expect(phonebooks.length).toBe(4)

        expect(phonebooks[0].name).toBe(phonebookJson.Sheet1[1].name)
        expect(phonebooks[0].email).toBe(phonebookJson.Sheet1[1].email)
        expect(phonebooks[0].mobile_number).toBe(
            phonebookJson.Sheet1[1].mobile_number
        )

        expect(phonebooks[1].name).toBe(phonebookJson.Sheet1[2].name)
        expect(phonebooks[1].email).toBe(phonebookJson.Sheet1[2].email)
        expect(phonebooks[1].mobile_number).toBe(
            phonebookJson.Sheet1[2].mobile_number
        )

        expect(phonebooks[2].name).toBe(phonebookJson.Sheet1[3].name)
        expect(phonebooks[2].email).toBe(phonebookJson.Sheet1[3].email)
        expect(phonebooks[2].mobile_number).toBe(
            phonebookJson.Sheet1[3].mobile_number
        )

        expect(phonebooks[3].name).toBe(phonebookJson.Sheet1[4].name)
        expect(phonebooks[3].email).toBe(phonebookJson.Sheet1[4].email)
        expect(phonebooks[3].mobile_number).toBe(
            phonebookJson.Sheet1[4].mobile_number
        )
    })
})
