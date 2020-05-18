// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(study_to_contact) {

    study_to_contact.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "studyDbId": {
                "type": ["string", "null"]
            },
            "contactDbId": {
                "type": ["string", "null"]
            }
        }
    }

    study_to_contact.prototype.asyncValidate = ajv.compile(
        study_to_contact.prototype.validatorSchema
    )

    study_to_contact.prototype.validateForCreate = async function(record) {
        return await study_to_contact.prototype.asyncValidate(record)
    }

    study_to_contact.prototype.validateForUpdate = async function(record) {
        return await study_to_contact.prototype.asyncValidate(record)
    }

    study_to_contact.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    study_to_contact.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return study_to_contact
}