// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(assay) {

    assay.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    assay.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "assay_id": {
                "type": ["string", "null"]
            },
            "measurement": {
                "type": ["string", "null"]
            },
            "technology": {
                "type": ["string", "null"]
            },
            "platform": {
                "type": ["string", "null"]
            },
            "method": {
                "type": ["string", "null"]
            },
            "study_id": {
                "type": ["string", "null"]
            },
            "factor_ids": {
                "type": ["array", "null"]
            },
            "material_ids": {
                "type": ["array", "null"]
            },
            "ontologyAnnotation_ids": {
                "type": ["array", "null"]
            },
            "fileAttachment_ids": {
                "type": ["array", "null"]
            }
        }
    }

    assay.prototype.asyncValidate = ajv.compile(
        assay.prototype.validatorSchema
    )

    assay.prototype.validateForCreate = async function(record) {
        return await assay.prototype.asyncValidate(record)
    }

    assay.prototype.validateForUpdate = async function(record) {
        return await assay.prototype.asyncValidate(record)
    }

    assay.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    assay.prototype.validateAfterRead = async function(record) {
        return await assay.prototype.asyncValidate(record)
    }

    return assay
}