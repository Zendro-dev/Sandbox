// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(environment) {

    environment.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    environment.prototype.validatorSchema = {
        "$async": true,
        "type": "object",
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "parameter": {
                "type": ["string", "null"]
            },
            "value": {
                "type": ["string", "null"]
            },
            "study_id": {
                "type": ["string", "null"]
            }
        }
    }

    environment.prototype.asyncValidate = ajv.compile(
        environment.prototype.validatorSchema
    )

    environment.prototype.validateForCreate = async function(record) {
        return await environment.prototype.asyncValidate(record)
    }

    environment.prototype.validateForUpdate = async function(record) {
        return await environment.prototype.asyncValidate(record)
    }

    environment.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    environment.prototype.validateAfterRead = async function(record) {
        return await environment.prototype.asyncValidate(record)
    }

    return environment
}