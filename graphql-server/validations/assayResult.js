// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(assayResult) {

    assayResult.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    assayResult.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "assayResult_id": {
                "type": ["string", "null"]
            },
            "unit": {
                "type": ["string", "null"]
            },
            "value_as_str": {
                "type": ["string", "null"]
            },
            "value_as_int": {
                "type": ["integer", "null"]
            },
            "value_as_num": {
                "type": ["number", "null"]
            },
            "value_as_bool": {
                "type": ["boolean", "null"]
            },
            "assay_id": {
                "type": ["string", "null"]
            },
            "material_id": {
                "type": ["string", "null"]
            },
            "ontologyAnnotation_ids": {
                "type": ["array", "null"]
            },
            "fileAttachment_ids": {
                "type": ["array", "null"]
            }
        }
    }

    assayResult.prototype.asyncValidate = ajv.compile(
        assayResult.prototype.validatorSchema
    )

    assayResult.prototype.validateForCreate = async function(record) {
        return await assayResult.prototype.asyncValidate(record)
    }

    assayResult.prototype.validateForUpdate = async function(record) {
        return await assayResult.prototype.asyncValidate(record)
    }

    assayResult.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    assayResult.prototype.validateAfterRead = async function(record) {
        return await assayResult.prototype.asyncValidate(record)
    }

    return assayResult
}