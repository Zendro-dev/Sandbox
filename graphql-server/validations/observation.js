// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(observation) {

    observation.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    observation.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "collector": {
                "type": ["string", "null"]
            },
            "germplasmDbId": {
                "type": ["string", "null"]
            },
            "observationTimeStamp": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "observationUnitDbId": {
                "type": ["string", "null"]
            },
            "observationVariableDbId": {
                "type": ["string", "null"]
            },
            "studyDbId": {
                "type": ["string", "null"]
            },
            "uploadedBy": {
                "type": ["string", "null"]
            },
            "value": {
                "type": ["string", "null"]
            },
            "observationDbId": {
                "type": ["string", "null"]
            },
            "seasonDbId": {
                "type": ["string", "null"]
            },
            "imageDbId": {
                "type": ["string", "null"]
            }
        }
    }

    observation.prototype.asyncValidate = ajv.compile(
        observation.prototype.validatorSchema
    )

    observation.prototype.validateForCreate = async function(record) {
        return await observation.prototype.asyncValidate(record)
    }

    observation.prototype.validateForUpdate = async function(record) {
        return await observation.prototype.asyncValidate(record)
    }

    observation.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    observation.prototype.validateAfterRead = async function(record) {
        return await observation.prototype.asyncValidate(record)
    }

    return observation
}