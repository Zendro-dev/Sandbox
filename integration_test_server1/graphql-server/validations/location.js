// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(location) {

    location.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    location.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "locationId": {
                "type": ["string", "null"]
            },
            "country": {
                "type": ["string", "null"]
            },
            "state": {
                "type": ["string", "null"]
            },
            "municipality": {
                "type": ["string", "null"]
            },
            "locality": {
                "type": ["string", "null"]
            }
        }
    }

    location.prototype.asyncValidate = ajv.compile(
        location.prototype.validatorSchema
    )

    location.prototype.validateForCreate = async function(record) {
        return await location.prototype.asyncValidate(record)
    }

    location.prototype.validateForUpdate = async function(record) {
        return await location.prototype.asyncValidate(record)
    }

    location.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    location.prototype.validateAfterRead = async function(record) {
        return await location.prototype.asyncValidate(record)
    }

    return location
}