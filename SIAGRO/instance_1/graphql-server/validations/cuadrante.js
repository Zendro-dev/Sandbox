// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(cuadrante) {

    cuadrante.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    cuadrante.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "cuadrante_id": {
                "type": ["string", "null"]
            },
            "produccion_valor": {
                "type": ["integer", "null"]
            },
            "produccion_etiqueta": {
                "type": ["string", "null"]
            },
            "autoconsumo_valor": {
                "type": ["integer", "null"]
            },
            "autoconsumo_etiqueta": {
                "type": ["string", "null"]
            },
            "compra_valor": {
                "type": ["integer", "null"]
            },
            "compra_etiqueta": {
                "type": ["string", "null"]
            },
            "venta_valor": {
                "type": ["integer", "null"]
            },
            "venta_etiqueta": {
                "type": ["string", "null"]
            },
            "nombre_comun_grupo_enfoque": {
                "type": ["string", "null"]
            },
            "grupo_enfoque_id": {
                "type": ["string", "null"]
            },
            "taxon_id": {
                "type": ["string", "null"]
            },
            "tipo_planta_id": {
                "type": ["string", "null"]
            }
        }
    }

    cuadrante.prototype.asyncValidate = ajv.compile(
        cuadrante.prototype.validatorSchema
    )

    cuadrante.prototype.validateForCreate = async function(record) {
        return await cuadrante.prototype.asyncValidate(record)
    }

    cuadrante.prototype.validateForUpdate = async function(record) {
        return await cuadrante.prototype.asyncValidate(record)
    }

    cuadrante.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    cuadrante.prototype.validateAfterRead = async function(record) {
        return await cuadrante.prototype.asyncValidate(record)
    }

    return cuadrante
}