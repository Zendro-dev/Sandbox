// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(process) {

    process.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    process.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "executesProtocol_fk": {
                "type": ["string", "null"]
            },
            "performer": {
                "type": ["string", "null"]
            },
            "date": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "previousProcess_fk": {
                "type": ["string", "null"]
            },
            "nextProcess_fk": {
                "type": ["string", "null"]
            },
            "inputs_source_fk": {
                "type": ["array", "null"]
            },
            "inputs_sample_fk": {
                "type": ["array", "null"]
            },
            "inputs_data_fk": {
                "type": ["array", "null"]
            },
            "inputs_material_fk": {
                "type": ["array", "null"]
            },
            "outputs_sample_fk": {
                "type": ["array", "null"]
            },
            "outputs_data_fk": {
                "type": ["array", "null"]
            },
            "outputs_material_fk": {
                "type": ["array", "null"]
            },
            "study_processSequence_fk": {
                "type": ["string", "null"]
            },
            "assay_processSequence_fk": {
                "type": ["string", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    process.prototype.asyncValidate = ajv.compile(
        process.prototype.validatorSchema
    )

    process.prototype.validateForCreate = async function(record) {
        return await process.prototype.asyncValidate(record)
    }

    process.prototype.validateForUpdate = async function(record) {
        return await process.prototype.asyncValidate(record)
    }

    process.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    process.prototype.validateAfterRead = async function(record) {
        return await process.prototype.asyncValidate(record)
    }

    return process
}