// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

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
        "properties": {
            "study_id": {
                "type": ["string", "null"]
            },
            "name": {
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
            "investigation_id": {
                "type": ["string", "null"]
            },
            "factor_ids": {
                "type": ["array", "null"]
            },
            "protocol_ids": {
                "type": ["array", "null"]
            },
            "contact_ids": {
                "type": ["array", "null"]
            },
            "material_ids": {
                "type": ["array", "null"]
            },
            "ontologyAnnotation_ids": {
                "type": ["array", "null"]
            },
            "fileAttachment_ids": {
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