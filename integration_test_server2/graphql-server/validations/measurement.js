// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(measurement) {

    measurement.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    measurement.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "measurement_id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "method": {
                "type": ["string", "null"]
            },
            "reference": {
                "type": ["string", "null"]
            },
            "accessionId": {
                "type": ["string", "null"]
            }
        }
    }

    measurement.prototype.asyncValidate = ajv.compile(
        measurement.prototype.validatorSchema
    )

    measurement.prototype.validateForCreate = async function(record) {
        return await measurement.prototype.asyncValidate(record)
    }

    measurement.prototype.validateForUpdate = async function(record) {
        return await measurement.prototype.asyncValidate(record)
    }

    measurement.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    measurement.prototype.validateAfterRead = async function(record) {
        return await measurement.prototype.asyncValidate(record)
    }

    return measurement
}