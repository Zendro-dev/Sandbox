// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(breedingMethod) {

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

    breedingMethod.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return breedingMethod
}