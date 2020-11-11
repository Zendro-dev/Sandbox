// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

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
            "fileAttachment_id": {
                "type": ["string", "null"]
            },
            "fileName": {
                "type": ["string", "null"]
            },
            "mimeType": {
                "type": ["string", "null"]
            },
            "fileSizeKb": {
                "type": ["integer", "null"]
            },
            "fileURL": {
                "type": ["string", "null"]
            },
            "isImage": {
                "type": ["boolean", "null"]
            },
            "smallThumbnailURL": {
                "type": ["string", "null"]
            },
            "bigThumbnailURL": {
                "type": ["string", "null"]
            },
            "investigation_ids": {
                "type": ["array", "null"]
            },
            "study_ids": {
                "type": ["array", "null"]
            },
            "assay_ids": {
                "type": ["array", "null"]
            },
            "assayResult_ids": {
                "type": ["array", "null"]
            },
            "factor_ids": {
                "type": ["array", "null"]
            },
            "material_ids": {
                "type": ["array", "null"]
            },
            "protocol_ids": {
                "type": ["array", "null"]
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