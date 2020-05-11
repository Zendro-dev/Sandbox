// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(trial_to_contact) {

    trial_to_contact.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "trialDbId": {
                "type": ["string", "null"]
            },
            "contactDbId": {
                "type": ["string", "null"]
            }
        }
    }

    trial_to_contact.prototype.asyncValidate = ajv.compile(
        trial_to_contact.prototype.validatorSchema
    )

    trial_to_contact.prototype.validateForCreate = async function(record) {
        return await trial_to_contact.prototype.asyncValidate(record)
    }

    trial_to_contact.prototype.validateForUpdate = async function(record) {
        return await trial_to_contact.prototype.asyncValidate(record)
    }

    trial_to_contact.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return trial_to_contact
}