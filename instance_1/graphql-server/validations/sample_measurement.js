// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(sample_measurement) {

    sample_measurement.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    sample_measurement.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "variable": {
                "type": ["string", "null"]
            },
            "value": {
                "type": ["number", "null"]
            },
            "unit": {
                "type": ["string", "null"]
            },
            "CAS_number": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "sample_id": {
                "type": ["integer", "null"]
            }
        }
    }

    sample_measurement.prototype.asyncValidate = ajv.compile(
        sample_measurement.prototype.validatorSchema
    )

    sample_measurement.prototype.validateForCreate = async function(record) {
        return await sample_measurement.prototype.asyncValidate(record)
    }

    sample_measurement.prototype.validateForUpdate = async function(record) {
        return await sample_measurement.prototype.asyncValidate(record)
    }

    sample_measurement.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    sample_measurement.prototype.validateAfterRead = async function(record) {
        return await sample_measurement.prototype.asyncValidate(record)
    }

    return sample_measurement
}