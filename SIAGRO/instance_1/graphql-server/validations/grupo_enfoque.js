// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(grupo_enfoque) {

    grupo_enfoque.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    grupo_enfoque.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "grupo_id": {
                "type": ["string", "null"]
            },
            "tipo_grupo": {
                "type": ["string", "null"]
            },
            "numero_participantes": {
                "type": ["integer", "null"]
            },
            "fecha": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "lista_especies": {
                "type": ["string", "null"]
            },
            "sitio_id": {
                "type": ["string", "null"]
            }
        }
    }

    grupo_enfoque.prototype.asyncValidate = ajv.compile(
        grupo_enfoque.prototype.validatorSchema
    )

    grupo_enfoque.prototype.validateForCreate = async function(record) {
        return await grupo_enfoque.prototype.asyncValidate(record)
    }

    grupo_enfoque.prototype.validateForUpdate = async function(record) {
        return await grupo_enfoque.prototype.asyncValidate(record)
    }

    grupo_enfoque.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    grupo_enfoque.prototype.validateAfterRead = async function(record) {
        return await grupo_enfoque.prototype.asyncValidate(record)
    }

    return grupo_enfoque
}