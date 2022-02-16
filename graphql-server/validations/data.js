// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(data) {

    data.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    data.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "type": {
                "type": ["string", "null"]
            },
            "fileName": {
                "type": ["string", "null"]
            },
            "mimeType": {
                "type": ["string", "null"]
            },
            "fileSize": {
                "type": ["integer", "null"]
            },
            "fileURL": {
                "type": ["string", "null"]
            },
            "assay_dataFiles_fk": {
                "type": ["string", "null"]
            },
            "process_inputs_data_fk": {
                "type": ["array", "null"]
            },
            "process_outputs_data_fk": {
                "type": ["array", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    data.prototype.asyncValidate = ajv.compile(
        data.prototype.validatorSchema
    )

    data.prototype.validateForCreate = async function(record) {
        return await data.prototype.asyncValidate(record)
    }

    data.prototype.validateForUpdate = async function(record) {
        return await data.prototype.asyncValidate(record)
    }

    data.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    data.prototype.validateAfterRead = async function(record) {
        return await data.prototype.asyncValidate(record)
    }

    return data
}