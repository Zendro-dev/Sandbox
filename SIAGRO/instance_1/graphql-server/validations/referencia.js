// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(referencia) {

    referencia.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    referencia.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "referencia_id": {
                "type": ["string", "null"]
            },
            "referencia": {
                "type": ["string", "null"]
            },
            "registros_ids": {
                "type": ["array", "string" ,"null"]
            }
        }
    }

    referencia.prototype.asyncValidate = ajv.compile(
        referencia.prototype.validatorSchema
    )

    referencia.prototype.validateForCreate = async function(record) {
        return await referencia.prototype.asyncValidate(record)
    }

    referencia.prototype.validateForUpdate = async function(record) {
        return await referencia.prototype.asyncValidate(record)
    }

    referencia.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    referencia.prototype.validateAfterRead = async function(record) {
        return await referencia.prototype.asyncValidate(record)
    }

    return referencia
}