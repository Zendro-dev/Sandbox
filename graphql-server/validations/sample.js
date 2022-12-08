// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(sample) {

    sample.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    sample.prototype.validatorSchema = {
        "$async": true,
        "type": "object",
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "value": {
                "type": ["string", "null"]
            },
            "plant_structure_development_stage": {
                "type": ["string", "null"]
            },
            "plant_anatomical_entity": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "collection_date": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "external_id": {
                "type": ["string", "null"]
            },
            "observation_unit_id": {
                "type": ["string", "null"]
            },
            "data_file_ids": {
                "type": ["array", "null"]
            }
        }
    }

    sample.prototype.asyncValidate = ajv.compile(
        sample.prototype.validatorSchema
    )

    sample.prototype.validateForCreate = async function(record) {
        return await sample.prototype.asyncValidate(record)
    }

    sample.prototype.validateForUpdate = async function(record) {
        return await sample.prototype.asyncValidate(record)
    }

    sample.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    sample.prototype.validateAfterRead = async function(record) {
        return await sample.prototype.asyncValidate(record)
    }

    return sample
}