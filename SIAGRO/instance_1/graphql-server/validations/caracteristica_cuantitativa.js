// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(caracteristica_cuantitativa) {

    caracteristica_cuantitativa.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    caracteristica_cuantitativa.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "nombre": {
                "type": ["string", "null"]
            },
            "valor": {
                "type": ["number", "null"]
            },
            "unidad": {
                "type": ["string", "null"]
            },
            "nombre_corto": {
                "type": ["string", "null"]
            },
            "comentarios": {
                "type": ["string", "null"]
            },
            "metodo_id": {
                "type": ["string", "null"]
            },
            "registro_id": {
                "type": ["string", "null"]
            }
        }
    }

    caracteristica_cuantitativa.prototype.asyncValidate = ajv.compile(
        caracteristica_cuantitativa.prototype.validatorSchema
    )

    caracteristica_cuantitativa.prototype.validateForCreate = async function(record) {
        return await caracteristica_cuantitativa.prototype.asyncValidate(record)
    }

    caracteristica_cuantitativa.prototype.validateForUpdate = async function(record) {
        return await caracteristica_cuantitativa.prototype.asyncValidate(record)
    }

    caracteristica_cuantitativa.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    caracteristica_cuantitativa.prototype.validateAfterRead = async function(record) {
        return await caracteristica_cuantitativa.prototype.asyncValidate(record)
    }

    return caracteristica_cuantitativa
}