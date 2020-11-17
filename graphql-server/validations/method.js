// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(method) {

    method.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    method.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "description": {
                "type": ["string", "null"]
            },
            "formula": {
                "type": ["string", "null"]
            },
            "methodClass": {
                "type": ["string", "null"]
            },
            "methodName": {
                "type": ["string", "null"]
            },
            "reference": {
                "type": ["string", "null"]
            },
            "methodDbId": {
                "type": ["string", "null"]
            },
            "ontologyDbId": {
                "type": ["string", "null"]
            }
        }
    }

    method.prototype.asyncValidate = ajv.compile(
        method.prototype.validatorSchema
    )

    method.prototype.validateForCreate = async function(record) {
        return await method.prototype.asyncValidate(record)
    }

    method.prototype.validateForUpdate = async function(record) {
        return await method.prototype.asyncValidate(record)
    }

    method.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    method.prototype.validateAfterRead = async function(record) {
        return await method.prototype.asyncValidate(record)
    }

    return method
}