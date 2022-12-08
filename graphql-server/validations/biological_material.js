// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(biological_material) {

    biological_material.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    biological_material.prototype.validatorSchema = {
        "$async": true,
        "type": "object",
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "organism": {
                "type": ["string", "null"]
            },
            "genus": {
                "type": ["string", "null"]
            },
            "species": {
                "type": ["string", "null"]
            },
            "infraspecific_name": {
                "type": ["string", "null"]
            },
            "location_latitude": {
                "type": ["string", "null"]
            },
            "location_longitude": {
                "type": ["string", "null"]
            },
            "location_altitude": {
                "type": ["number", "null"]
            },
            "location_coordinates_uncertainty": {
                "type": ["number", "null"]
            },
            "preprocessing": {
                "type": ["string", "null"]
            },
            "source_id": {
                "type": ["string", "null"]
            },
            "source_doi": {
                "type": ["string", "null"]
            },
            "source_latitude": {
                "type": ["string", "null"]
            },
            "source_longitude": {
                "type": ["string", "null"]
            },
            "source_altitude": {
                "type": ["number", "null"]
            },
            "source_coordinates_uncertainty": {
                "type": ["number", "null"]
            },
            "source_description": {
                "type": ["string", "null"]
            },
            "study_ids": {
                "type": ["array", "null"]
            },
            "observation_unit_ids": {
                "type": ["array", "null"]
            }
        }
    }

    biological_material.prototype.asyncValidate = ajv.compile(
        biological_material.prototype.validatorSchema
    )

    biological_material.prototype.validateForCreate = async function(record) {
        return await biological_material.prototype.asyncValidate(record)
    }

    biological_material.prototype.validateForUpdate = async function(record) {
        return await biological_material.prototype.asyncValidate(record)
    }

    biological_material.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    biological_material.prototype.validateAfterRead = async function(record) {
        return await biological_material.prototype.asyncValidate(record)
    }

    return biological_material
}