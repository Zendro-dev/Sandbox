// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(toy) {

    toy.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    toy.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "cat_id": {
                "type": ["string", "null"]
            }
        }
    }

    toy.prototype.asyncValidate = ajv.compile(
        toy.prototype.validatorSchema
    )

    toy.prototype.validateForCreate = async function(record) {
        return await toy.prototype.asyncValidate(record)
    }

    toy.prototype.validateForUpdate = async function(record) {
        return await toy.prototype.asyncValidate(record)
    }

    toy.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    toy.prototype.validateAfterRead = async function(record) {
        return await toy.prototype.asyncValidate(record)
    }

    return toy
}