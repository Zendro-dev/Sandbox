// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(publication) {

    publication.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    publication.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "pubMedID": {
                "type": ["string", "null"]
            },
            "doi": {
                "type": ["string", "null"]
            },
            "authorList": {
                "type": ["string", "null"]
            },
            "title": {
                "type": ["string", "null"]
            },
            "status_fk": {
                "type": ["string", "null"]
            },
            "study_publications_fk": {
                "type": ["array", "null"]
            },
            "investigation_publications_fk": {
                "type": ["string", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    publication.prototype.asyncValidate = ajv.compile(
        publication.prototype.validatorSchema
    )

    publication.prototype.validateForCreate = async function(record) {
        return await publication.prototype.asyncValidate(record)
    }

    publication.prototype.validateForUpdate = async function(record) {
        return await publication.prototype.asyncValidate(record)
    }

    publication.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    publication.prototype.validateAfterRead = async function(record) {
        return await publication.prototype.asyncValidate(record)
    }

    return publication
}