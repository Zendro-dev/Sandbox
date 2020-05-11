// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(season) {

    season.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "season": {
                "type": ["string", "null"]
            },
            "seasonDbId": {
                "type": ["string", "null"]
            },
            "year": {
                "type": ["integer", "null"]
            }
        }
    }

    season.prototype.asyncValidate = ajv.compile(
        season.prototype.validatorSchema
    )

    season.prototype.validateForCreate = async function(record) {
        return await season.prototype.asyncValidate(record)
    }

    season.prototype.validateForUpdate = async function(record) {
        return await season.prototype.asyncValidate(record)
    }

    season.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return season
}