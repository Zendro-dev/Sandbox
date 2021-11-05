// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(data_file) {

    data_file.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    data_file.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "url": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "version": {
                "type": ["string", "null"]
            },
            "study_id": {
                "type": ["string", "null"]
            },
            "observation_unit_ids": {
                "type": ["array", "null"]
            },
            "observed_variable_ids": {
                "type": ["array", "null"]
            },
            "sample_ids": {
                "type": ["array", "null"]
            }
        }
    }

    data_file.prototype.asyncValidate = ajv.compile(
        data_file.prototype.validatorSchema
    )

    data_file.prototype.validateForCreate = async function(record) {
        return await data_file.prototype.asyncValidate(record)
    }

    data_file.prototype.validateForUpdate = async function(record) {
        return await data_file.prototype.asyncValidate(record)
    }

    data_file.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    data_file.prototype.validateAfterRead = async function(record) {
        return await data_file.prototype.asyncValidate(record)
    }

    return data_file
}