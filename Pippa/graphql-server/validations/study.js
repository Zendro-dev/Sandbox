// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(study) {

    study.prototype.validatorSchema = {
        "$async": true,
        "properties": {
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
            "studyDbId": {
                "type": ["string", "null"]
            },
            "locationDbId": {
                "type": ["string", "null"]
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

    study.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    study.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return study
}