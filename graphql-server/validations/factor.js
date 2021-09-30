// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(factor) {

    factor.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    factor.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "factor_id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "type": {
                "type": ["string", "null"]
            },
            "assay_ids": {
                "type": ["array", "null"]
            },
            "study_ids": {
                "type": ["array", "null"]
            },
            "ontologyAnnotation_ids": {
                "type": ["array", "null"]
            }
        }
    }

    factor.prototype.asyncValidate = ajv.compile(
        factor.prototype.validatorSchema
    )

    factor.prototype.validateForCreate = async function(record) {
        return await factor.prototype.asyncValidate(record)
    }

    factor.prototype.validateForUpdate = async function(record) {
        return await factor.prototype.asyncValidate(record)
    }

    factor.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    factor.prototype.validateAfterRead = async function(record) {
        return await factor.prototype.asyncValidate(record)
    }

    return factor
}