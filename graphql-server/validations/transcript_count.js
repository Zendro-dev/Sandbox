// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(transcript_count) {

    transcript_count.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    transcript_count.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "gene_id": {
                "type": ["string", "null"]
            },
            "expression_count": {
                "type": ["number", "null"]
            },
            "expression_unit": {
                "type": ["string", "null"]
            },
            "treatment": {
                "type": ["string", "null"]
            },
            "replicate_no": {
                "type": ["string", "null"]
            },
            "study_id": {
                "type": ["string", "null"]
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

    transcript_count.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    transcript_count.prototype.validateAfterRead = async function(record) {
        return await transcript_count.prototype.asyncValidate(record)
    }

    return transcript_count
}