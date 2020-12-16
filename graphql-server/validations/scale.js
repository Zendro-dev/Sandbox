// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(scale) {

    scale.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    scale.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "decimalPlaces": {
                "type": ["integer", "null"]
            },
            "scaleName": {
                "type": ["string", "null"]
            },
            "xref": {
                "type": ["string", "null"]
            },
            "scaleDbId": {
                "type": ["string", "null"]
            },
            "ontologyDbId": {
                "type": ["string", "null"]
            }
        }
    }

    scale.prototype.asyncValidate = ajv.compile(
        scale.prototype.validatorSchema
    )

    scale.prototype.validateForCreate = async function(record) {
        return await scale.prototype.asyncValidate(record)
    }

    scale.prototype.validateForUpdate = async function(record) {
        return await scale.prototype.asyncValidate(record)
    }

    scale.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    scale.prototype.validateAfterRead = async function(record) {
        return await scale.prototype.asyncValidate(record)
    }

    return scale
}