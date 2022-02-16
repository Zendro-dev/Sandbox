// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(process_parameter_value) {

    process_parameter_value.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    process_parameter_value.prototype.validatorSchema = {
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
            "process_parameterValues_fk": {
                "type": ["string", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    process_parameter_value.prototype.asyncValidate = ajv.compile(
        process_parameter_value.prototype.validatorSchema
    )

    process_parameter_value.prototype.validateForCreate = async function(record) {
        return await process_parameter_value.prototype.asyncValidate(record)
    }

    process_parameter_value.prototype.validateForUpdate = async function(record) {
        return await process_parameter_value.prototype.asyncValidate(record)
    }

    process_parameter_value.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    process_parameter_value.prototype.validateAfterRead = async function(record) {
        return await process_parameter_value.prototype.asyncValidate(record)
    }

    return process_parameter_value
}