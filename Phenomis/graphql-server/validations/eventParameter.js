// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(eventParameter) {

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

    eventParameter.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return eventParameter
}