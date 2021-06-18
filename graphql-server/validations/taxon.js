// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(taxon) {

    taxon.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    taxon.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["integer", "null"]
            },
            "Genero": {
                "type": ["string", "null"]
            },
            "EpitetoEspecifico": {
                "type": ["string", "null"]
            },
            "EpitetoSubespecie": {
                "type": ["string", "null"]
            },
            "EpitetoVariedad": {
                "type": ["string", "null"]
            },
            "EpitetoForma": {
                "type": ["string", "null"]
            },
            "EpitetoRaza": {
                "type": ["string", "null"]
            },
            "EpitetoCultivar": {
                "type": ["string", "null"]
            }
        }
    }

    taxon.prototype.asyncValidate = ajv.compile(
        taxon.prototype.validatorSchema
    )

    taxon.prototype.validateForCreate = async function(record) {
        return await taxon.prototype.asyncValidate(record)
    }

    taxon.prototype.validateForUpdate = async function(record) {
        return await taxon.prototype.asyncValidate(record)
    }

    taxon.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    taxon.prototype.validateAfterRead = async function(record) {
        return await taxon.prototype.asyncValidate(record)
    }

    return taxon
}