// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(sample) {

    sample.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "sampling_date": {
                "type": ["string", "null"]
            },
            "type": {
                "type": ["string", "null"]
            },
            "biological_replicate_no": {
                "type": ["integer", "null"]
            },
            "lab_code": {
                "type": ["string", "null"]
            },
            "treatment": {
                "type": ["string", "null"]
            },
            "tissue": {
                "type": ["string", "null"]
            },
            "individual_id": {
                "type": ["integer", "null"]
            },
            "sequencing_experiment_id": {
                "type": ["integer", "null"]
            }
        }
    }

    sample.prototype.asyncValidate = ajv.compile(
        sample.prototype.validatorSchema
    )

    sample.prototype.validateForCreate = async function(record) {
        let ret = await sample.prototype.asyncValidate(record);
        console.log("\n\nret: " + ret + "\n\n")
        console.log("\n\nret: " + JSON.stringify(ret) + "\n\n")
        return ret;
    }

    sample.prototype.validateForUpdate = async function(record) {
        return await sample.prototype.asyncValidate(record)
    }

    sample.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    sample.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return sample
}