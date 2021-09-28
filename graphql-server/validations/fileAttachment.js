// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(fileAttachment) {

    fileAttachment.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    fileAttachment.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "fileName": {
                "type": ["string", "null"]
            },
            "fileURL": {
                "type": ["string", "null"]
            },
            "mimeType": {
                "type": ["string", "null"]
            },
            "fileSize": {
                "type": ["integer", "null"]
            },
            "identifierName": {
                "type": ["string", "null"]
            },
            "investigation_id": {
                "type": ["string", "null"]
            },
            "study_id": {
                "type": ["string", "null"]
            },
            "assay_id": {
                "type": ["string", "null"]
            },
            "factor_id": {
                "type": ["string", "null"]
            },
            "material_id": {
                "type": ["string", "null"]
            },
            "protocol_id": {
                "type": ["string", "null"]
            }
        }
    }

    fileAttachment.prototype.asyncValidate = ajv.compile(
        fileAttachment.prototype.validatorSchema
    )

    fileAttachment.prototype.validateForCreate = async function(record) {
        return await fileAttachment.prototype.asyncValidate(record)
    }

    fileAttachment.prototype.validateForUpdate = async function(record) {
        return await fileAttachment.prototype.asyncValidate(record)
    }

    fileAttachment.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    fileAttachment.prototype.validateAfterRead = async function(record) {
        return await fileAttachment.prototype.asyncValidate(record)
    }

    return fileAttachment
}