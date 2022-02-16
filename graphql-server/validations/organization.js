// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(organization) {

    organization.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    organization.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    organization.prototype.asyncValidate = ajv.compile(
        organization.prototype.validatorSchema
    )

    organization.prototype.validateForCreate = async function(record) {
        return await organization.prototype.asyncValidate(record)
    }

    organization.prototype.validateForUpdate = async function(record) {
        return await organization.prototype.asyncValidate(record)
    }

    organization.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    organization.prototype.validateAfterRead = async function(record) {
        return await organization.prototype.asyncValidate(record)
    }

    return organization
}