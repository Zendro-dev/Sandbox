// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(post_book) {

    post_book.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    post_book.prototype.validatorSchema = {
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

    post_book.prototype.asyncValidate = ajv.compile(
        post_book.prototype.validatorSchema
    )

    post_book.prototype.validateForCreate = async function(record) {
        return await post_book.prototype.asyncValidate(record)
    }

    post_book.prototype.validateForUpdate = async function(record) {
        return await post_book.prototype.asyncValidate(record)
    }

    post_book.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    post_book.prototype.validateAfterRead = async function(record) {
        return await post_book.prototype.asyncValidate(record)
    }

    return post_book
}