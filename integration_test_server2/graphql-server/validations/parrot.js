// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(parrot) {

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

    parrot.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    parrot.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return parrot
}