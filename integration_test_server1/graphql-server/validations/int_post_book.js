// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(int_post_book) {

    int_post_book.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    int_post_book.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["integer", "null"]
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

    int_post_book.prototype.asyncValidate = ajv.compile(
        int_post_book.prototype.validatorSchema
    )

    int_post_book.prototype.validateForCreate = async function(record) {
        return await int_post_book.prototype.asyncValidate(record)
    }

    int_post_book.prototype.validateForUpdate = async function(record) {
        return await int_post_book.prototype.asyncValidate(record)
    }

    int_post_book.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    int_post_book.prototype.validateAfterRead = async function(record) {
        return await int_post_book.prototype.asyncValidate(record)
    }

    return int_post_book
}