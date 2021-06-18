// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(manejo) {

    manejo.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    manejo.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "manejo_id": {
                "type": ["integer", "null"]
            },
            "TipoManejo": {
                "type": ["string", "null"]
            },
            "TipoAgroecosistema": {
                "type": ["string", "null"]
            },
            "DescripcionAgroecosistema": {
                "type": ["string", "null"]
            },
            "SindromeDomesticacion": {
                "type": ["string", "null"]
            },
            "TenenciaTierra": {
                "type": ["string", "null"]
            },
            "TipoMaterialProduccion": {
                "type": ["string", "null"]
            },
            "OrigenMaterial": {
                "type": ["string", "null"]
            },
            "DestinoProduccion": {
                "type": ["string", "null"]
            },
            "MesSiembra": {
                "type": ["string", "null"]
            },
            "MesFloracion": {
                "type": ["string", "null"]
            },
            "MesFructificacion": {
                "type": ["string", "null"]
            },
            "MesCosecha": {
                "type": ["string", "null"]
            },
            "SistemaCultivo": {
                "type": ["string", "null"]
            },
            "CultivosAsociados": {
                "type": ["string", "null"]
            },
            "UnidadesSuperficieProduccion": {
                "type": ["string", "null"]
            },
            "SuperficieProduccion": {
                "type": ["number", "null"]
            },
            "UnidadesRendimiento": {
                "type": ["string", "null"]
            },
            "Rendimiento": {
                "type": ["number", "null"]
            },
            "TipoRiego": {
                "type": ["string", "null"]
            },
            "CaracteristicaResistenciaTolerancia": {
                "type": ["string", "null"]
            },
            "CaracteristicaSusceptible": {
                "type": ["string", "null"]
            },
            "registro_id": {
                "type": ["string", "null"]
            }
        }
    }

    manejo.prototype.asyncValidate = ajv.compile(
        manejo.prototype.validatorSchema
    )

    manejo.prototype.validateForCreate = async function(record) {
        return await manejo.prototype.asyncValidate(record)
    }

    manejo.prototype.validateForUpdate = async function(record) {
        return await manejo.prototype.asyncValidate(record)
    }

    manejo.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    manejo.prototype.validateAfterRead = async function(record) {
        return await manejo.prototype.asyncValidate(record)
    }

    return manejo
}