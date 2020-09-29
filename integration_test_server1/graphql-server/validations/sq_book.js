// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(sq_book) {

    sq_book.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    sq_book.prototype.validatorSchema = {
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
            },
            "author_ids": {
              "type": ["array", "null"]
            }
        }
    }

    sq_book.prototype.asyncValidate = ajv.compile(
        sq_book.prototype.validatorSchema
    )

    sq_book.prototype.validateForCreate = async function(record) {
        return await sq_book.prototype.asyncValidate(record)
    }

    sq_book.prototype.validateForUpdate = async function(record) {
        return await sq_book.prototype.asyncValidate(record)
    }

    sq_book.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    sq_book.prototype.validateAfterRead = async function(record) {
        return await sq_book.prototype.asyncValidate(record)
    }

    return sq_book
}
