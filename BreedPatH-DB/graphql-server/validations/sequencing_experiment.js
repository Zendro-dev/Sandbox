// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(sequencing_experiment) {

    sequencing_experiment.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "start_date": {
                "type": ["string", "null"]
            },
            "end_date": {
                "type": ["string", "null"]
            },
            "protocol": {
                "type": ["string", "null"]
            },
            "platform": {
                "type": ["string", "null"]
            },
            "data_type": {
                "type": ["string", "null"]
            },
            "library_type": {
                "type": ["string", "null"]
            },
            "library_preparation": {
                "type": ["string", "null"]
            },
            "aimed_coverage": {
                "type": ["number", "null"]
            },
            "resulting_coverage": {
                "type": ["number", "null"]
            },
            "insert_size": {
                "type": ["number", "null"]
            },
            "aimed_read_length": {
                "type": ["string", "null"]
            },
            "genome_complexity_reduction": {
                "type": ["string", "null"]
            },
            "contamination": {
                "type": ["string", "null"]
            }
        }
    }

    sequencing_experiment.prototype.asyncValidate = ajv.compile(
        sequencing_experiment.prototype.validatorSchema
    )

    sequencing_experiment.prototype.validateForCreate = async function(record) {
        let ret = await sequencing_experiment.prototype.asyncValidate(record);
        console.log("\n\nret: " + ret + "\n\n")
        console.log("\n\nret: " + JSON.stringify(ret) + "\n\n")
        return ret;
    }

    sequencing_experiment.prototype.validateForUpdate = async function(record) {
        return await sequencing_experiment.prototype.asyncValidate(record)
    }

    sequencing_experiment.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    sequencing_experiment.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return sequencing_experiment
}