// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(aminoacidsequence) {

    aminoacidsequence.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "accession": {
                "type": ["string", "null"]
            },
            "sequence": {
                "type": ["string", "null"]
            }
        }
    }

    aminoacidsequence.prototype.asyncValidate = ajv.compile(
        aminoacidsequence.prototype.validatorSchema
    )

    aminoacidsequence.prototype.validateForCreate = async function(record) {
        return await aminoacidsequence.prototype.asyncValidate(record)
    }

    aminoacidsequence.prototype.validateForUpdate = async function(record) {
        return await aminoacidsequence.prototype.asyncValidate(record)
    }

    aminoacidsequence.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    aminoacidsequence.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return aminoacidsequence
}