// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(parrot) {

    parrot.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    parrot.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "parrot_id": {
                "type": ["string", "null"]
            },
            "person_id": {
                "type": ["string", "null"]
            }
        }
    }

    parrot.prototype.asyncValidate = ajv.compile(
        parrot.prototype.validatorSchema
    )

    parrot.prototype.validateForCreate = async function(record) {
        return await parrot.prototype.asyncValidate(record)
    }

    parrot.prototype.validateForUpdate = async function(record) {
        return await parrot.prototype.asyncValidate(record)
    }

    parrot.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    parrot.prototype.validateAfterRead = async function(record) {
        return await parrot.prototype.asyncValidate(record)
    }

    return parrot
}