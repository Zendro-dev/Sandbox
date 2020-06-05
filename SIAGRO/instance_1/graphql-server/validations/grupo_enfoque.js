// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(grupo_enfoque) {

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
            "observaciones": {
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

    grupo_enfoque.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    grupo_enfoque.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return grupo_enfoque
}