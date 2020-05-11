// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(trial) {

    trial.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "active": {
                "type": ["boolean", "null"]
            },
            "commonCropName": {
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
            "programDbId": {
                "type": ["string", "null"]
            },
            "startDate": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "trialDescription": {
                "type": ["string", "null"]
            },
            "trialName": {
                "type": ["string", "null"]
            },
            "trialPUI": {
                "type": ["string", "null"]
            },
            "trialDbId": {
                "type": ["string", "null"]
            }
        }
    }

    trial.prototype.asyncValidate = ajv.compile(
        trial.prototype.validatorSchema
    )

    trial.prototype.validateForCreate = async function(record) {
        return await trial.prototype.asyncValidate(record)
    }

    trial.prototype.validateForUpdate = async function(record) {
        return await trial.prototype.asyncValidate(record)
    }

    trial.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return trial
}