// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(employer) {

    employer.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "employer": {
                "type": ["string", "null"]
            }
        }
    }

    employer.prototype.asyncValidate = ajv.compile(
        employer.prototype.validatorSchema
    )

    employer.prototype.validateForCreate = async function(record) {
        return await employer.prototype.asyncValidate(record)
    }

    employer.prototype.validateForUpdate = async function(record) {
        return await employer.prototype.asyncValidate(record)
    }

    employer.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return employer
}