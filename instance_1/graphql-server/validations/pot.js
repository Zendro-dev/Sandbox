// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(pot) {

    pot.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    pot.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "pot": {
                "type": ["string", "null"]
            },
            "greenhouse": {
                "type": ["string", "null"]
            },
            "climate_chamber": {
                "type": ["string", "null"]
            },
            "conditions": {
                "type": ["string", "null"]
            }
        }
    }

    pot.prototype.asyncValidate = ajv.compile(
        pot.prototype.validatorSchema
    )

    pot.prototype.validateForCreate = async function(record) {
        return await pot.prototype.asyncValidate(record)
    }

    pot.prototype.validateForUpdate = async function(record) {
        return await pot.prototype.asyncValidate(record)
    }

    pot.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    pot.prototype.validateAfterRead = async function(record) {
        return await pot.prototype.asyncValidate(record)
    }

    return pot
}