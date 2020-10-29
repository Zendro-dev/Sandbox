// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(int_post_author) {

    int_post_author.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    int_post_author.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["integer","string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "lastname": {
                "type": ["string", "null"]
            },
            "email": {
                "type": ["string", "null"]
            },
            "book_ids": {
                "type": ["array", "null"]
            }
        }
    }

    int_post_author.prototype.asyncValidate = ajv.compile(
        int_post_author.prototype.validatorSchema
    )

    int_post_author.prototype.validateForCreate = async function(record) {
        return await int_post_author.prototype.asyncValidate(record)
    }

    int_post_author.prototype.validateForUpdate = async function(record) {
        return await int_post_author.prototype.asyncValidate(record)
    }

    int_post_author.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    int_post_author.prototype.validateAfterRead = async function(record) {
        return await int_post_author.prototype.asyncValidate(record)
    }

    return int_post_author
}
