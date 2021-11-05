// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(observation_unit) {

    observation_unit.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    observation_unit.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "type": {
                "type": ["string", "null"]
            },
            "external_id": {
                "type": ["string", "null"]
            },
            "spatial_distribution": {
                "type": ["string", "null"]
            },
            "study_id": {
                "type": ["string", "null"]
            },
            "biological_material_ids": {
                "type": ["array", "null"]
            },
            "data_file_ids": {
                "type": ["array", "null"]
            },
            "event_ids": {
                "type": ["array", "null"]
            },
            "factor_ids": {
                "type": ["array", "null"]
            }
        }
    }

    observation_unit.prototype.asyncValidate = ajv.compile(
        observation_unit.prototype.validatorSchema
    )

    observation_unit.prototype.validateForCreate = async function(record) {
        return await observation_unit.prototype.asyncValidate(record)
    }

    observation_unit.prototype.validateForUpdate = async function(record) {
        return await observation_unit.prototype.asyncValidate(record)
    }

    observation_unit.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    observation_unit.prototype.validateAfterRead = async function(record) {
        return await observation_unit.prototype.asyncValidate(record)
    }

    return observation_unit
}