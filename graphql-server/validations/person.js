// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(person) {

    person.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    person.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "email": {
                "type": ["string", "null"]
            },
            "role": {
                "type": ["string", "null"]
            },
            "affiliation": {
                "type": ["string", "null"]
            },
            "investigation_ids": {
                "type": ["array", "null"]
            },
            "study_ids": {
                "type": ["array", "null"]
            }
        }
    }

    person.prototype.asyncValidate = ajv.compile(
        person.prototype.validatorSchema
    )

    person.prototype.validateForCreate = async function(record) {
        return await person.prototype.asyncValidate(record)
    }

    person.prototype.validateForUpdate = async function(record) {
        return await person.prototype.asyncValidate(record)
    }

    person.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    person.prototype.validateAfterRead = async function(record) {
        return await person.prototype.asyncValidate(record)
    }

    return person
}