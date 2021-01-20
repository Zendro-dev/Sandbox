// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(author) {

    author.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    author.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "author_id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            }
        }
    }

    author.prototype.asyncValidate = ajv.compile(
        author.prototype.validatorSchema
    )

    author.prototype.validateForCreate = async function(record) {
        return await author.prototype.asyncValidate(record)
    }

    author.prototype.validateForUpdate = async function(record) {
        return await author.prototype.asyncValidate(record)
    }

    author.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    author.prototype.validateAfterRead = async function(record) {
        return await author.prototype.asyncValidate(record)
    }

    return author
}