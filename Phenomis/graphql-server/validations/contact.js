// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(contact) {

    contact.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "contactDbId": {
                "type": ["string", "null"]
            },
            "email": {
                "type": ["string", "null"]
            },
            "instituteName": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "orcid": {
                "type": ["string", "null"]
            },
            "type": {
                "type": ["string", "null"]
            }
        }
    }

    contact.prototype.asyncValidate = ajv.compile(
        contact.prototype.validatorSchema
    )

    contact.prototype.validateForCreate = async function(record) {
        return await contact.prototype.asyncValidate(record)
    }

    contact.prototype.validateForUpdate = async function(record) {
        return await contact.prototype.asyncValidate(record)
    }

    contact.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    contact.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return contact
}