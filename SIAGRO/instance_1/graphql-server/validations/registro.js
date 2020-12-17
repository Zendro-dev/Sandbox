// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(registro) {

    registro.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    registro.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "conabio_id": {
                "type": ["string", "null"]
            },
            "clave_original": {
                "type": ["string", "null"]
            },
            "tipo_alimento": {
                "type": ["string", "null"]
            },
            "food_type": {
                "type": ["string", "null"]
            },
            "descripcion_alimento": {
                "type": ["string", "null"]
            },
            "food_description": {
                "type": ["string", "null"]
            },
            "procedencia": {
                "type": ["string", "null"]
            },
            "taxon_id": {
                "type": ["string", "null"]
            },
            "referencias_ids": {
                "type": ["array", "string" ,"null"]
            }
        }
    }

    registro.prototype.asyncValidate = ajv.compile(
        registro.prototype.validatorSchema
    )

    registro.prototype.validateForCreate = async function(record) {
        return await registro.prototype.asyncValidate(record)
    }

    registro.prototype.validateForUpdate = async function(record) {
        return await registro.prototype.asyncValidate(record)
    }

    registro.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    registro.prototype.validateAfterRead = async function(record) {
        return await registro.prototype.asyncValidate(record)
    }

    return registro
}