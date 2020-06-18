// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(nuc_acid_library_result) {

    nuc_acid_library_result.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "lab_code": {
                "type": ["string", "null"]
            },
            "file_name": {
                "type": ["string", "null"]
            },
            "file_uri": {
                "type": ["string", "null"]
            },
            "type": {
                "type": ["string", "null"]
            },
            "insert_size": {
                "type": ["number", "null"]
            },
            "technical_replicate": {
                "type": ["integer", "null"]
            },
            "trimmed": {
                "type": ["boolean", "null"]
            },
            "sample_id": {
                "type": ["integer", "null"]
            }
        }
    }

    nuc_acid_library_result.prototype.asyncValidate = ajv.compile(
        nuc_acid_library_result.prototype.validatorSchema
    )

    nuc_acid_library_result.prototype.validateForCreate = async function(record) {
        let ret = await nuc_acid_library_result.prototype.asyncValidate(record);
        console.log("\n\nret: " + ret + "\n\n")
        console.log("\n\nret: " + JSON.stringify(ret) + "\n\n")
        return ret;
    }

    nuc_acid_library_result.prototype.validateForUpdate = async function(record) {
        return await nuc_acid_library_result.prototype.asyncValidate(record)
    }

    nuc_acid_library_result.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    nuc_acid_library_result.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return nuc_acid_library_result
}