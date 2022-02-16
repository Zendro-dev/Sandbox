// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(factor_value) {

    factor_value.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    factor_value.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "category_fk": {
                "type": ["string", "null"]
            },
            "value": {
                "type": ["string", "null"]
            },
            "unit_fk": {
                "type": ["string", "null"]
            },
            "sample_factorValues_fk": {
                "type": ["array", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    factor_value.prototype.asyncValidate = ajv.compile(
        factor_value.prototype.validatorSchema
    )

    factor_value.prototype.validateForCreate = async function(record) {
        return await factor_value.prototype.asyncValidate(record)
    }

    factor_value.prototype.validateForUpdate = async function(record) {
        return await factor_value.prototype.asyncValidate(record)
    }

    factor_value.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    factor_value.prototype.validateAfterRead = async function(record) {
        return await factor_value.prototype.asyncValidate(record)
    }

    return factor_value
}