// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(observationUnit) {

    observationUnit.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "germplasmDbId": {
                "type": ["string", "null"]
            },
            "locationDbId": {
                "type": ["string", "null"]
            },
            "observationLevel": {
                "type": ["string", "null"]
            },
            "observationUnitName": {
                "type": ["string", "null"]
            },
            "observationUnitPUI": {
                "type": ["string", "null"]
            },
            "plantNumber": {
                "type": ["string", "null"]
            },
            "plotNumber": {
                "type": ["string", "null"]
            },
            "programDbId": {
                "type": ["string", "null"]
            },
            "studyDbId": {
                "type": ["string", "null"]
            },
            "trialDbId": {
                "type": ["string", "null"]
            },
            "observationUnitDbId": {
                "type": ["string", "null"]
            }
        }
    }

    observationUnit.prototype.asyncValidate = ajv.compile(
        observationUnit.prototype.validatorSchema
    )

    observationUnit.prototype.validateForCreate = async function(record) {
        return await observationUnit.prototype.asyncValidate(record)
    }

    observationUnit.prototype.validateForUpdate = async function(record) {
        return await observationUnit.prototype.asyncValidate(record)
    }

    observationUnit.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return observationUnit
}