// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(local_book) {

    local_book.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    local_book.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "book_id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "country_ids": {
                "type": ["array", "null"]
            },
            "publisher_id": {
                "type": ["string", "null"]
            }
        }
    }

    local_book.prototype.asyncValidate = ajv.compile(
        local_book.prototype.validatorSchema
    )

    local_book.prototype.validateForCreate = async function(record) {
        return await local_book.prototype.asyncValidate(record)
    }

    local_book.prototype.validateForUpdate = async function(record) {
        return await local_book.prototype.asyncValidate(record)
    }

    local_book.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    local_book.prototype.validateAfterRead = async function(record) {
        return await local_book.prototype.asyncValidate(record)
    }

    return local_book
}