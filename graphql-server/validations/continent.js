// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(continent) {

    continent.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    continent.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "continent_id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            }
        }
    }

    continent.prototype.asyncValidate = ajv.compile(
        continent.prototype.validatorSchema
    )

    continent.prototype.validateForCreate = async function(record) {
        return await continent.prototype.asyncValidate(record)
    }

    continent.prototype.validateForUpdate = async function(record) {
        return await continent.prototype.asyncValidate(record)
    }

    continent.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    continent.prototype.validateAfterRead = async function(record) {
        return await continent.prototype.asyncValidate(record)
    }

    return continent
}