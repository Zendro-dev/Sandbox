// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(observationTreatment) {

    observationTreatment.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "factor": {
                "type": ["string", "null"]
            },
            "modality": {
                "type": ["string", "null"]
            },
            "observationUnitDbId": {
                "type": ["string", "null"]
            },
            "observationTreatmentDbId": {
                "type": ["string", "null"]
            }
        }
    }

    observationTreatment.prototype.asyncValidate = ajv.compile(
        observationTreatment.prototype.validatorSchema
    )

    observationTreatment.prototype.validateForCreate = async function(record) {
        return await observationTreatment.prototype.asyncValidate(record)
    }

    observationTreatment.prototype.validateForUpdate = async function(record) {
        return await observationTreatment.prototype.asyncValidate(record)
    }

    observationTreatment.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    observationTreatment.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return observationTreatment
}