// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(protocol_parameter) {

    protocol_parameter.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    protocol_parameter.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "parameterName_fk": {
                "type": ["string", "null"]
            },
            "protocol_parameters": {
                "type": ["array", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    protocol_parameter.prototype.asyncValidate = ajv.compile(
        protocol_parameter.prototype.validatorSchema
    )

    protocol_parameter.prototype.validateForCreate = async function(record) {
        return await protocol_parameter.prototype.asyncValidate(record)
    }

    protocol_parameter.prototype.validateForUpdate = async function(record) {
        return await protocol_parameter.prototype.asyncValidate(record)
    }

    protocol_parameter.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    protocol_parameter.prototype.validateAfterRead = async function(record) {
        return await protocol_parameter.prototype.asyncValidate(record)
    }

    return protocol_parameter
}