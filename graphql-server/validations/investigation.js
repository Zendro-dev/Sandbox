// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(investigation) {

    investigation.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    investigation.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "investigation_id": {
                "type": ["string", "null"]
            },
            "title": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "beginDate": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "endDate": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "ontologyAnnotation_ids": {
                "type": ["array", "null"]
            },
            "contact_ids": {
                "type": ["array", "null"]
            },
            "fileAttachment_ids": {
                "type": ["array", "null"]
            }
        }
    }

    investigation.prototype.asyncValidate = ajv.compile(
        investigation.prototype.validatorSchema
    )

    investigation.prototype.validateForCreate = async function(record) {
        return await investigation.prototype.asyncValidate(record)
    }

    investigation.prototype.validateForUpdate = async function(record) {
        return await investigation.prototype.asyncValidate(record)
    }

    investigation.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    investigation.prototype.validateAfterRead = async function(record) {
        return await investigation.prototype.asyncValidate(record)
    }

    return investigation
}