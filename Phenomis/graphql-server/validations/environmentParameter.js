// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(environmentParameter) {

    environmentParameter.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "description": {
                "type": ["string", "null"]
            },
            "parameterName": {
                "type": ["string", "null"]
            },
            "parameterPUI": {
                "type": ["string", "null"]
            },
            "unit": {
                "type": ["string", "null"]
            },
            "unitPUI": {
                "type": ["string", "null"]
            },
            "value": {
                "type": ["string", "null"]
            },
            "valuePUI": {
                "type": ["string", "null"]
            },
            "studyDbId": {
                "type": ["string", "null"]
            },
            "environmentParameterDbId": {
                "type": ["string", "null"]
            }
        }
    }

    environmentParameter.prototype.asyncValidate = ajv.compile(
        environmentParameter.prototype.validatorSchema
    )

    environmentParameter.prototype.validateForCreate = async function(record) {
        return await environmentParameter.prototype.asyncValidate(record)
    }

    environmentParameter.prototype.validateForUpdate = async function(record) {
        return await environmentParameter.prototype.asyncValidate(record)
    }

    environmentParameter.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return environmentParameter
}