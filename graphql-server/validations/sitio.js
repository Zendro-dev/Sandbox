// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(sitio) {

    sitio.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    sitio.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "paismapa": {
                "type": ["string", "null"]
            },
            "estadomapa": {
                "type": ["string", "null"]
            },
            "claveestadomapa": {
                "type": ["string", "null"]
            },
            "clavemunicipiomapa": {
                "type": ["string", "null"]
            },
            "municipiomapa": {
                "type": ["string", "null"]
            },
            "localidad": {
                "type": ["string", "null"]
            },
            "latitud": {
                "type": ["number", "null"]
            },
            "longitud": {
                "type": ["number", "null"]
            },
            "datum": {
                "type": ["string", "null"]
            }
        }
    }

    sitio.prototype.asyncValidate = ajv.compile(
        sitio.prototype.validatorSchema
    )

    sitio.prototype.validateForCreate = async function(record) {
        return await sitio.prototype.asyncValidate(record)
    }

    sitio.prototype.validateForUpdate = async function(record) {
        return await sitio.prototype.asyncValidate(record)
    }

    sitio.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    sitio.prototype.validateAfterRead = async function(record) {
        return await sitio.prototype.asyncValidate(record)
    }

    return sitio
}