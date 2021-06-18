// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(determinacion) {

    determinacion.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    determinacion.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "determinador": {
                "type": ["string", "null"]
            },
            "fechadeterminacion": {
                "type": ["string", "null"]
            },
            "calificadordeterminacion": {
                "type": ["string", "null"]
            },
            "tipo": {
                "type": ["string", "null"]
            }
        }
    }

    determinacion.prototype.asyncValidate = ajv.compile(
        determinacion.prototype.validatorSchema
    )

    determinacion.prototype.validateForCreate = async function(record) {
        return await determinacion.prototype.asyncValidate(record)
    }

    determinacion.prototype.validateForUpdate = async function(record) {
        return await determinacion.prototype.asyncValidate(record)
    }

    determinacion.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    determinacion.prototype.validateAfterRead = async function(record) {
        return await determinacion.prototype.asyncValidate(record)
    }

    return determinacion
}