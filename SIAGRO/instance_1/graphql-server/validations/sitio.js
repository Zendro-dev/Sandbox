// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(sitio) {

    sitio.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "sitio_id": {
                "type": ["string", "null"]
            },
            "pais": {
                "type": ["string", "null"]
            },
            "estado": {
                "type": ["string", "null"]
            },
            "municipio": {
                "type": ["string", "null"]
            },
            "localidad": {
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

    sitio.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    sitio.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return sitio
}