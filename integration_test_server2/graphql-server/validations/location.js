// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(location) {

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

    location.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    location.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return location
}