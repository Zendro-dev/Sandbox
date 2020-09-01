// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(sqlite_book) {

    sqlite_book.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    sqlite_book.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "title": {
                "type": ["string", "null"]
            },
            "genre": {
                "type": ["string", "null"]
            },
            "ISBN": {
                "type": ["string", "null"]
            }
        }
    }

    sqlite_book.prototype.asyncValidate = ajv.compile(
        sqlite_book.prototype.validatorSchema
    )

    sqlite_book.prototype.validateForCreate = async function(record) {
        return await sqlite_book.prototype.asyncValidate(record)
    }

    sqlite_book.prototype.validateForUpdate = async function(record) {
        return await sqlite_book.prototype.asyncValidate(record)
    }

    sqlite_book.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    sqlite_book.prototype.validateAfterRead = async function(record) {
        return await sqlite_book.prototype.asyncValidate(record)
    }

    return sqlite_book
}