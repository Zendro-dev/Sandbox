// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(season) {

    season.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

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
            },
            "studyDbIds": {
                "type": ["array", "null"]
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

    season.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    season.prototype.validateAfterRead = async function(record) {
        return await season.prototype.asyncValidate(record)
    }

    return season
}