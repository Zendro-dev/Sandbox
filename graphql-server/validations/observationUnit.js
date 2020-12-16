// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(observationUnit) {

    observationUnit.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    observationUnit.prototype.validatorSchema = {
        "$async": true,
        "properties": {
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
            },
            "germplasmDbId": {
                "type": ["string", "null"]
            },
            "locationDbId": {
                "type": ["string", "null"]
            },
            "eventDbIds": {
                "type": ["array", "null"]
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

    observationUnit.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    observationUnit.prototype.validateAfterRead = async function(record) {
        return await observationUnit.prototype.asyncValidate(record)
    }

    return observationUnit
}