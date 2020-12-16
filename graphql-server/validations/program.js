// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(program) {

    program.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    program.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "abbreviation": {
                "type": ["string", "null"]
            },
            "commonCropName": {
                "type": ["string", "null"]
            },
            "documentationURL": {
                "type": ["string", "null"]
            },
            "leadPersonDbId": {
                "type": ["string", "null"]
            },
            "objective": {
                "type": ["string", "null"]
            },
            "programName": {
                "type": ["string", "null"]
            },
            "programDbId": {
                "type": ["string", "null"]
            }
        }
    }

    program.prototype.asyncValidate = ajv.compile(
        program.prototype.validatorSchema
    )

    program.prototype.validateForCreate = async function(record) {
        return await program.prototype.asyncValidate(record)
    }

    program.prototype.validateForUpdate = async function(record) {
        return await program.prototype.asyncValidate(record)
    }

    program.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    program.prototype.validateAfterRead = async function(record) {
        return await program.prototype.asyncValidate(record)
    }

    return program
}