// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(scale) {

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

    scale.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return scale
}