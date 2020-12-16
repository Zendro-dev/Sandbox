// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(metodo) {

    metodo.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    metodo.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "descripcion": {
                "type": ["string", "null"]
            },
            "referencias": {
                "type": ["array", "string", "null"]
            },
            "link_referencias": {
                "type": ["array", "string" ,"null"]
            }
        }
    }

    metodo.prototype.asyncValidate = ajv.compile(
        metodo.prototype.validatorSchema
    )

    metodo.prototype.validateForCreate = async function(record) {
        return await metodo.prototype.asyncValidate(record)
    }

    metodo.prototype.validateForUpdate = async function(record) {
        return await metodo.prototype.asyncValidate(record)
    }

    metodo.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    metodo.prototype.validateAfterRead = async function(record) {
        return await metodo.prototype.asyncValidate(record)
    }

    return metodo
}
