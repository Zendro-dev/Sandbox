// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(registro_snib) {

    registro_snib.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    registro_snib.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "procedenciaejemplar": {
                "type": ["string", "null"]
            },
            "fechacolecta": {
                "type": ["string", "null"]
            },
            "numcolecta": {
                "type": ["string", "null"]
            },
            "ambiente": {
                "type": ["string", "null"]
            },
            "colector": {
                "type": ["string", "null"]
            },
            "coleccion": {
                "type": ["string", "null"]
            },
            "numcatalogo": {
                "type": ["string", "null"]
            },
            "proyecto": {
                "type": ["string", "null"]
            },
            "formadecitar": {
                "type": ["string", "null"]
            },
            "licenciauso": {
                "type": ["string", "null"]
            },
            "urlproyecto": {
                "type": ["string", "null"]
            },
            "urlejemplar": {
                "type": ["string", "null"]
            },
            "version": {
                "type": ["string", "null"]
            }
        }
    }

    registro_snib.prototype.asyncValidate = ajv.compile(
        registro_snib.prototype.validatorSchema
    )

    registro_snib.prototype.validateForCreate = async function(record) {
        return await registro_snib.prototype.asyncValidate(record)
    }

    registro_snib.prototype.validateForUpdate = async function(record) {
        return await registro_snib.prototype.asyncValidate(record)
    }

    registro_snib.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    registro_snib.prototype.validateAfterRead = async function(record) {
        return await registro_snib.prototype.asyncValidate(record)
    }

    return registro_snib
}