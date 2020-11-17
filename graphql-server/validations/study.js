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
            "studyDbId": {
                "type": ["string", "null"]
            },
            "active": {
                "type": ["boolean", "null"]
            },
            "commonCropName": {
                "type": ["string", "null"]
            },
            "culturalPractices": {
                "type": ["string", "null"]
            },
            "documentationURL": {
                "type": ["string", "null"]
            },
            "endDate": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "license": {
                "type": ["string", "null"]
            },
            "observationUnitsDescription": {
                "type": ["string", "null"]
            },
            "startDate": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "studyDescription": {
                "type": ["string", "null"]
            },
            "studyName": {
                "type": ["string", "null"]
            },
            "studyType": {
                "type": ["string", "null"]
            },
            "trialDbId": {
                "type": ["string", "null"]
            },
            "locationDbId": {
                "type": ["string", "null"]
            },
            "contactDbIds": {
                "type": ["array", "null"]
            },
            "seasonDbIds": {
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