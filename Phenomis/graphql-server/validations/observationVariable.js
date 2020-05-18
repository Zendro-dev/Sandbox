// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(observationVariable) {

    observationVariable.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "commonCropName": {
                "type": ["string", "null"]
            },
            "defaultValue": {
                "type": ["string", "null"]
            },
            "documentationURL": {
                "type": ["string", "null"]
            },
            "growthStage": {
                "type": ["string", "null"]
            },
            "institution": {
                "type": ["string", "null"]
            },
            "language": {
                "type": ["string", "null"]
            },
            "scientist": {
                "type": ["string", "null"]
            },
            "status": {
                "type": ["string", "null"]
            },
            "submissionTimestamp": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "xref": {
                "type": ["string", "null"]
            },
            "observationVariableDbId": {
                "type": ["string", "null"]
            },
            "observationVariableName": {
                "type": ["string", "null"]
            },
            "methodDbId": {
                "type": ["string", "null"]
            },
            "scaleDbId": {
                "type": ["string", "null"]
            },
            "traitDbId": {
                "type": ["string", "null"]
            },
            "ontologyDbId": {
                "type": ["string", "null"]
            }
        }
    }

    observationVariable.prototype.asyncValidate = ajv.compile(
        observationVariable.prototype.validatorSchema
    )

    observationVariable.prototype.validateForCreate = async function(record) {
        return await observationVariable.prototype.asyncValidate(record)
    }

    observationVariable.prototype.validateForUpdate = async function(record) {
        return await observationVariable.prototype.asyncValidate(record)
    }

    observationVariable.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    observationVariable.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return observationVariable
}