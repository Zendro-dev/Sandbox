// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(breedingMethod) {

    breedingMethod.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    breedingMethod.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "abbreviation": {
                "type": ["string", "null"]
            },
            "breedingMethodDbId": {
                "type": ["string", "null"]
            },
            "breedingMethodName": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            }
        }
    }

    breedingMethod.prototype.asyncValidate = ajv.compile(
        breedingMethod.prototype.validatorSchema
    )

    breedingMethod.prototype.validateForCreate = async function(record) {
        return await breedingMethod.prototype.asyncValidate(record)
    }

    breedingMethod.prototype.validateForUpdate = async function(record) {
        return await breedingMethod.prototype.asyncValidate(record)
    }

    breedingMethod.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    breedingMethod.prototype.validateAfterRead = async function(record) {
        return await breedingMethod.prototype.asyncValidate(record)
    }

    return breedingMethod
}