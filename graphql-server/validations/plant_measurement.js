// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(plant_measurement) {

    plant_measurement.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    plant_measurement.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "measurement_id": {
                "type": ["string", "null"]
            },
            "plant_id": {
                "type": ["string", "null"]
            },
            "measurement": {
                "type": ["string", "null"]
            },
            "value": {
                "type": ["string", "null"]
            },
            "unit": {
                "type": ["string", "null"]
            }
        }
    }

    plant_measurement.prototype.asyncValidate = ajv.compile(
        plant_measurement.prototype.validatorSchema
    )

    plant_measurement.prototype.validateForCreate = async function(record) {
        return await plant_measurement.prototype.asyncValidate(record)
    }

    plant_measurement.prototype.validateForUpdate = async function(record) {
        return await plant_measurement.prototype.asyncValidate(record)
    }

    plant_measurement.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    plant_measurement.prototype.validateAfterRead = async function(record) {
        return await plant_measurement.prototype.asyncValidate(record)
    }

    return plant_measurement
}