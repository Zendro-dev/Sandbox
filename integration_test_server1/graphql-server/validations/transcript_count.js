// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(transcript_count) {

    transcript_count.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "gene": {
                "type": ["string", "null"]
            },
            "variable": {
                "type": ["string", "null"]
            },
            "count": {
                "type": ["number", "null"]
            },
            "tissue_or_condition": {
                "type": ["string", "null"]
            },
            "individual_id": {
                "type": ["integer", "null"]
            },
            "aminoacidsequence_id": {
                "type": ["integer", "null"]
            }
        }
    }

    transcript_count.prototype.asyncValidate = ajv.compile(
        transcript_count.prototype.validatorSchema
    )

    transcript_count.prototype.validateForCreate = async function(record) {
        return await transcript_count.prototype.asyncValidate(record)
    }

    transcript_count.prototype.validateForUpdate = async function(record) {
        return await transcript_count.prototype.asyncValidate(record)
    }

    transcript_count.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    transcript_count.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return transcript_count
}