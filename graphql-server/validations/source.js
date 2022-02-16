// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(source) {

    source.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    source.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "characteristics_fk": {
                "type": ["array", "null"]
            },
            "derived_children_fk": {
                "type": ["array", "null"]
            },
            "study_materials_sources_fk": {
                "type": ["array", "null"]
            },
            "process_inputs_source_fk": {
                "type": ["array", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    source.prototype.asyncValidate = ajv.compile(
        source.prototype.validatorSchema
    )

    source.prototype.validateForCreate = async function(record) {
        return await source.prototype.asyncValidate(record)
    }

    source.prototype.validateForUpdate = async function(record) {
        return await source.prototype.asyncValidate(record)
    }

    source.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    source.prototype.validateAfterRead = async function(record) {
        return await source.prototype.asyncValidate(record)
    }

    return source
}