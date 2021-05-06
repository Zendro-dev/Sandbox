// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(tipo_planta) {

    tipo_planta.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    tipo_planta.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "tipo_planta_id": {
                "type": ["string", "null"]
            },
            "tipo_planta": {
                "type": ["string", "null"]
            },
            "foto_produccion": {
                "type": ["string", "null"]
            },
            "foto_autoconsumo": {
                "type": ["string", "null"]
            },
            "foto_venta": {
                "type": ["string", "null"]
            },
            "foto_compra": {
                "type": ["string", "null"]
            },
            "justificacion_produccion_cuadrante1": {
                "type": ["string", "null"]
            },
            "justificacion_produccion_cuadrante2": {
                "type": ["string", "null"]
            },
            "justificacion_produccion_cuadrante3": {
                "type": ["string", "null"]
            },
            "justificacion_produccion_cuadrante4": {
                "type": ["string", "null"]
            }
        }
    }

    tipo_planta.prototype.asyncValidate = ajv.compile(
        tipo_planta.prototype.validatorSchema
    )

    tipo_planta.prototype.validateForCreate = async function(record) {
        return await tipo_planta.prototype.asyncValidate(record)
    }

    tipo_planta.prototype.validateForUpdate = async function(record) {
        return await tipo_planta.prototype.asyncValidate(record)
    }

    tipo_planta.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    tipo_planta.prototype.validateAfterRead = async function(record) {
        return await tipo_planta.prototype.asyncValidate(record)
    }

    return tipo_planta
}