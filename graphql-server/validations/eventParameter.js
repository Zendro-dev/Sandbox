// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(eventParameter) {

    eventParameter.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    eventParameter.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "key": {
                "type": ["string", "null"]
            },
            "rdfValue": {
                "type": ["string", "null"]
            },
            "value": {
                "type": ["string", "null"]
            },
            "eventDbId": {
                "type": ["string", "null"]
            },
            "eventParameterDbId": {
                "type": ["string", "null"]
            }
        }
    }

    eventParameter.prototype.asyncValidate = ajv.compile(
        eventParameter.prototype.validatorSchema
    )

    eventParameter.prototype.validateForCreate = async function(record) {
        return await eventParameter.prototype.asyncValidate(record)
    }

    eventParameter.prototype.validateForUpdate = async function(record) {
        return await eventParameter.prototype.asyncValidate(record)
    }

    eventParameter.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    eventParameter.prototype.validateAfterRead = async function(record) {
        return await eventParameter.prototype.asyncValidate(record)
    }

    return eventParameter
}