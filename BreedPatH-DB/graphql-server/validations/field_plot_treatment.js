// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(field_plot_treatment) {

    field_plot_treatment.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "start_date": {
                "type": ["string", "null"]
            },
            "end_date": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "chemical": {
                "type": ["string", "null"]
            },
            "pesticide_type": {
                "type": ["string", "null"]
            },
            "field_plot_id": {
                "type": ["integer", "null"]
            }
        }
    }

    field_plot_treatment.prototype.asyncValidate = ajv.compile(
        field_plot_treatment.prototype.validatorSchema
    )

    field_plot_treatment.prototype.validateForCreate = async function(record) {
        let ret = await field_plot_treatment.prototype.asyncValidate(record);
        console.log("\n\nret: " + ret + "\n\n")
        console.log("\n\nret: " + JSON.stringify(ret) + "\n\n")
        return ret;
    }

    field_plot_treatment.prototype.validateForUpdate = async function(record) {
        return await field_plot_treatment.prototype.asyncValidate(record)
    }

    field_plot_treatment.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    field_plot_treatment.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return field_plot_treatment
}