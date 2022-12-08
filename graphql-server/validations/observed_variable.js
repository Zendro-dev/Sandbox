// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(observed_variable) {

    observed_variable.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    observed_variable.prototype.validatorSchema = {
        "$async": true,
        "type": "object",
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "accession_number": {
                "type": ["string", "null"]
            },
            "trait": {
                "type": ["string", "null"]
            },
            "trait_accession_number": {
                "type": ["string", "null"]
            },
            "method": {
                "type": ["string", "null"]
            },
            "method_accession_number": {
                "type": ["string", "null"]
            },
            "method_description": {
                "type": ["string", "null"]
            },
            "scale": {
                "type": ["string", "null"]
            },
            "scale_accession_number": {
                "type": ["string", "null"]
            },
            "time_scale": {
                "type": ["string", "null"]
            },
            "study_ids": {
                "type": ["array", "null"]
            },
            "data_file_ids": {
                "type": ["array", "null"]
            }
        }
    }

    observed_variable.prototype.asyncValidate = ajv.compile(
        observed_variable.prototype.validatorSchema
    )

    observed_variable.prototype.validateForCreate = async function(record) {
        return await observed_variable.prototype.asyncValidate(record)
    }

    observed_variable.prototype.validateForUpdate = async function(record) {
        return await observed_variable.prototype.asyncValidate(record)
    }

    observed_variable.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    observed_variable.prototype.validateAfterRead = async function(record) {
        return await observed_variable.prototype.asyncValidate(record)
    }

    return observed_variable
}