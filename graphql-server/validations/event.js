// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(event) {

    event.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    event.prototype.validatorSchema = {
        "$async": true,
        "type": "object",
        "properties": {
            "eventDbId": {
                "type": ["string", "null"]
            },
            "eventDescription": {
                "type": ["string", "null"]
            },
            "eventType": {
                "type": ["string", "null"]
            },
            "date": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "observationUnitDbIds": {
                "type": ["array", "null"]
            }
        }
    }

    event.prototype.asyncValidate = ajv.compile(
        event.prototype.validatorSchema
    )

    event.prototype.validateForCreate = async function(record) {
        return await event.prototype.asyncValidate(record)
    }

    event.prototype.validateForUpdate = async function(record) {
        return await event.prototype.asyncValidate(record)
    }

    event.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    event.prototype.validateAfterRead = async function(record) {
        return await event.prototype.asyncValidate(record)
    }

    return event
}