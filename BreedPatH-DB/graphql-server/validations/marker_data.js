// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(marker_data) {

    marker_data.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "marker_name": {
                "type": ["string", "null"]
            },
            "nucleotide": {
                "type": ["string", "null"]
            },
            "individual_id": {
                "type": ["integer", "null"]
            }
        }
    }

    marker_data.prototype.asyncValidate = ajv.compile(
        marker_data.prototype.validatorSchema
    )

    marker_data.prototype.validateForCreate = async function(record) {
        let ret = await marker_data.prototype.asyncValidate(record);
        console.log("\n\nret: " + ret + "\n\n")
        console.log("\n\nret: " + JSON.stringify(ret) + "\n\n")
        return ret;
    }

    marker_data.prototype.validateForUpdate = async function(record) {
        return await marker_data.prototype.asyncValidate(record)
    }

    marker_data.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    marker_data.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return marker_data
}