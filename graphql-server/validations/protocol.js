// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(protocol) {

    protocol.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    protocol.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "protocol_id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "type": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "study_ids": {
                "type": ["array", "null"]
            },
            "assay_ids": {
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

    protocol.prototype.asyncValidate = ajv.compile(
        protocol.prototype.validatorSchema
    )

    protocol.prototype.validateForCreate = async function(record) {
        return await protocol.prototype.asyncValidate(record)
    }

    protocol.prototype.validateForUpdate = async function(record) {
        return await protocol.prototype.asyncValidate(record)
    }

    protocol.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    protocol.prototype.validateAfterRead = async function(record) {
        return await protocol.prototype.asyncValidate(record)
    }

    return protocol
}