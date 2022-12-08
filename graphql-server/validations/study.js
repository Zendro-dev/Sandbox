// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(study) {

    study.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    study.prototype.validatorSchema = {
        "$async": true,
        "type": "object",
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "title": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "startDate": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "endDate": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "institution": {
                "type": ["string", "null"]
            },
            "location_country": {
                "type": ["string", "null"]
            },
            "location_latitude": {
                "type": ["string", "null"]
            },
            "location_longitude": {
                "type": ["string", "null"]
            },
            "location_altitude": {
                "type": ["string", "null"]
            },
            "experimental_site_name": {
                "type": ["string", "null"]
            },
            "experimental_design_type": {
                "type": ["string", "null"]
            },
            "experimental_design_description": {
                "type": ["string", "null"]
            },
            "experimental_design_map": {
                "type": ["string", "null"]
            },
            "observation_unit_level_hirarchy": {
                "type": ["string", "null"]
            },
            "observation_unit_description": {
                "type": ["string", "null"]
            },
            "growth_facility": {
                "type": ["string", "null"]
            },
            "growth_facility_description": {
                "type": ["string", "null"]
            },
            "cultural_practices": {
                "type": ["string", "null"]
            },
            "investigation_id": {
                "type": ["string", "null"]
            },
            "person_ids": {
                "type": ["array", "null"]
            },
            "observed_variable_ids": {
                "type": ["array", "null"]
            },
            "biological_material_ids": {
                "type": ["array", "null"]
            }
        }
    }

    study.prototype.asyncValidate = ajv.compile(
        study.prototype.validatorSchema
    )

    study.prototype.validateForCreate = async function(record) {
        return await study.prototype.asyncValidate(record)
    }

    study.prototype.validateForUpdate = async function(record) {
        return await study.prototype.asyncValidate(record)
    }

    study.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    study.prototype.validateAfterRead = async function(record) {
        return await study.prototype.asyncValidate(record)
    }

    return study
}