// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(publisher) {

    publisher.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    publisher.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "publisher_id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            }
        }
    }

    publisher.prototype.asyncValidate = ajv.compile(
        publisher.prototype.validatorSchema
    )

    publisher.prototype.validateForCreate = async function(record) {
        return await publisher.prototype.asyncValidate(record)
    }

    publisher.prototype.validateForUpdate = async function(record) {
        return await publisher.prototype.asyncValidate(record)
    }

    publisher.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    publisher.prototype.validateAfterRead = async function(record) {
        return await publisher.prototype.asyncValidate(record)
    }

    return publisher
}