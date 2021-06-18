// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(proyecto) {

    proyecto.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    proyecto.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "proyecto_id": {
                "type": ["string", "null"]
            },
            "NombreProyecto": {
                "type": ["string", "null"]
            },
            "InstitucionProyecto": {
                "type": ["string", "null"]
            },
            "FechaInicioProyecto": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "FechaFinProyecto": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            }
        }
    }

    proyecto.prototype.asyncValidate = ajv.compile(
        proyecto.prototype.validatorSchema
    )

    proyecto.prototype.validateForCreate = async function(record) {
        return await proyecto.prototype.asyncValidate(record)
    }

    proyecto.prototype.validateForUpdate = async function(record) {
        return await proyecto.prototype.asyncValidate(record)
    }

    proyecto.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    proyecto.prototype.validateAfterRead = async function(record) {
        return await proyecto.prototype.asyncValidate(record)
    }

    return proyecto
}