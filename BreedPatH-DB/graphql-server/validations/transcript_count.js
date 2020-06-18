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
            "value": {
                "type": ["number", "null"]
            },
            "method": {
                "type": ["string", "null"]
            },
            "reference_genome": {
                "type": ["string", "null"]
            },
            "sample_id": {
                "type": ["integer", "null"]
            }
        }
    }

    transcript_count.prototype.asyncValidate = ajv.compile(
        transcript_count.prototype.validatorSchema
    )

    transcript_count.prototype.validateForCreate = async function(record) {
        let ret = await transcript_count.prototype.asyncValidate(record);
        console.log("\n\nret: " + ret + "\n\n")
        console.log("\n\nret: " + JSON.stringify(ret) + "\n\n")
        return ret;
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

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return transcript_count
}