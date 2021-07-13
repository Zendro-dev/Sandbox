// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(local_capital) {

    local_capital.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    local_capital.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "capital_id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "country_id": {
                "type": ["string", "null"]
            }
        }
    }

    local_capital.prototype.asyncValidate = ajv.compile(
        local_capital.prototype.validatorSchema
    )

    local_capital.prototype.validateForCreate = async function(record) {
        return await local_capital.prototype.asyncValidate(record)
    }

    local_capital.prototype.validateForUpdate = async function(record) {
        return await local_capital.prototype.asyncValidate(record)
    }

    local_capital.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    local_capital.prototype.validateAfterRead = async function(record) {
        return await local_capital.prototype.asyncValidate(record)
    }

    return local_capital
}