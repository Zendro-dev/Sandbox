// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(observationUnit_to_event) {

    observationUnit_to_event.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "observationUnitDbId": {
                "type": ["string", "null"]
            },
            "eventDbId": {
                "type": ["string", "null"]
            }
        }
    }

    observationUnit_to_event.prototype.asyncValidate = ajv.compile(
        observationUnit_to_event.prototype.validatorSchema
    )

    observationUnit_to_event.prototype.validateForCreate = async function(record) {
        return await observationUnit_to_event.prototype.asyncValidate(record)
    }

    observationUnit_to_event.prototype.validateForUpdate = async function(record) {
        return await observationUnit_to_event.prototype.asyncValidate(record)
    }

    observationUnit_to_event.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return observationUnit_to_event
}