// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(ontologyReference) {

    ontologyReference.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "documentationURL": {
                "type": ["string", "null"]
            },
            "ontologyDbId": {
                "type": ["string", "null"]
            },
            "ontologyName": {
                "type": ["string", "null"]
            },
            "version": {
                "type": ["string", "null"]
            }
        }
    }

    ontologyReference.prototype.asyncValidate = ajv.compile(
        ontologyReference.prototype.validatorSchema
    )

    ontologyReference.prototype.validateForCreate = async function(record) {
        return await ontologyReference.prototype.asyncValidate(record)
    }

    ontologyReference.prototype.validateForUpdate = async function(record) {
        return await ontologyReference.prototype.asyncValidate(record)
    }

    ontologyReference.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return ontologyReference
}