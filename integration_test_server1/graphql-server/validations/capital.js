// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(capital) {

    capital.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "country_id": {
                "type": ["string", "null"]
            },
            "capital_id": {
                "type": ["string", "null"]
            }
        }
    }

    capital.prototype.asyncValidate = ajv.compile(
        capital.prototype.validatorSchema
    )

    capital.prototype.validateForCreate = async function(record) {
        return await capital.prototype.asyncValidate(record)
    }

    capital.prototype.validateForUpdate = async function(record) {
        return await capital.prototype.asyncValidate(record)
    }

    capital.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    capital.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return capital
}