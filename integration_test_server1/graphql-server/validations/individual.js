// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(individual) {

    individual.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    individual.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            }
        }
    }

    individual.prototype.asyncValidate = ajv.compile(
        individual.prototype.validatorSchema
    )

    individual.prototype.validateForCreate = async function(record) {
        return await individual.prototype.asyncValidate(record)
    }

    individual.prototype.validateForUpdate = async function(record) {
        return await individual.prototype.asyncValidate(record)
    }

    individual.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    individual.prototype.validateAfterRead = async function(record) {
        return await individual.prototype.asyncValidate(record)
    }

    return individual
}