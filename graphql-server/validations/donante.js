// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(donante) {

    donante.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    donante.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "donante_id": {
                "type": ["integer", "null"]
            },
            "NombreDonanteInformante": {
                "type": ["string", "null"]
            },
            "GeneroDonanteInformante": {
                "type": ["string", "null"]
            },
            "EdadDonanteInformante": {
                "type": ["integer", "null"]
            },
            "ActividadDonanteInformante": {
                "type": ["string", "null"]
            },
            "GrupoEtnicoDonanteInformante": {
                "type": ["string", "null"]
            },
            "LenguaDonanteInformante": {
                "type": ["string", "null"]
            }
        }
    }

    donante.prototype.asyncValidate = ajv.compile(
        donante.prototype.validatorSchema
    )

    donante.prototype.validateForCreate = async function(record) {
        return await donante.prototype.asyncValidate(record)
    }

    donante.prototype.validateForUpdate = async function(record) {
        return await donante.prototype.asyncValidate(record)
    }

    donante.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    donante.prototype.validateAfterRead = async function(record) {
        return await donante.prototype.asyncValidate(record)
    }

    return donante
}