// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(registro_siagro) {

    registro_siagro.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    registro_siagro.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "siagro_id": {
                "type": ["string", "null"]
            },
            "IndividuosCopias": {
                "type": ["integer", "null"]
            },
            "TipoPreparacion": {
                "type": ["string", "null"]
            },
            "FuenteColectaObservacion": {
                "type": ["string", "null"]
            },
            "Habitat": {
                "type": ["string", "null"]
            },
            "EstatusEcologico": {
                "type": ["string", "null"]
            },
            "PlantaManejada": {
                "type": ["string", "null"]
            },
            "MaterialColectado": {
                "type": ["string", "null"]
            },
            "FormaVida": {
                "type": ["string", "null"]
            },
            "FormaCrecimiento": {
                "type": ["string", "null"]
            },
            "Sexo": {
                "type": ["string", "null"]
            },
            "Fenologia": {
                "type": ["string", "null"]
            },
            "AlturaEjemplar": {
                "type": ["number", "null"]
            },
            "Abundancia": {
                "type": ["string", "null"]
            },
            "OtrasObservacionesEjemplar": {
                "type": ["string", "null"]
            },
            "Uso": {
                "type": ["string", "null"]
            },
            "ParteUtilizada": {
                "type": ["string", "null"]
            },
            "LenguaNombreComun": {
                "type": ["string", "null"]
            },
            "NombreComun": {
                "type": ["string", "null"]
            },
            "InstitucionRespaldaObservacion": {
                "type": ["string", "null"]
            },
            "TipoVegetacion": {
                "type": ["string", "null"]
            },
            "AutorizacionInformacion": {
                "type": ["string", "null"]
            },
            "donante_id": {
                "type": ["integer", "null"]
            },
            "proyecto_id": {
                "type": ["string", "null"]
            },
            "snib_id": {
                "type": ["string", "null"]
            }
        }
    }

    registro_siagro.prototype.asyncValidate = ajv.compile(
        registro_siagro.prototype.validatorSchema
    )

    registro_siagro.prototype.validateForCreate = async function(record) {
        return await registro_siagro.prototype.asyncValidate(record)
    }

    registro_siagro.prototype.validateForUpdate = async function(record) {
        return await registro_siagro.prototype.asyncValidate(record)
    }

    registro_siagro.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    registro_siagro.prototype.validateAfterRead = async function(record) {
        return await registro_siagro.prototype.asyncValidate(record)
    }

    return registro_siagro
}