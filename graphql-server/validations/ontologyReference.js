// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(ontologyReference) {

    ontologyReference.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    ontologyReference.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "documentationURL": {
                "type": ["string", "null"]
            },
            "ontologyDbId": {
                "type": ["string", "null"]
            },
            "ontologyName": {
                "type": ["string", "null"]
            },
            "version": {
                "type": ["string", "null"]
            }
        }
    }

    ontologyReference.prototype.asyncValidate = ajv.compile(
        ontologyReference.prototype.validatorSchema
    )

    ontologyReference.prototype.validateForCreate = async function(record) {
        return await ontologyReference.prototype.asyncValidate(record)
    }

    ontologyReference.prototype.validateForUpdate = async function(record) {
        return await ontologyReference.prototype.asyncValidate(record)
    }

    ontologyReference.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    ontologyReference.prototype.validateAfterRead = async function(record) {
        return await ontologyReference.prototype.asyncValidate(record)
    }

    return ontologyReference
}