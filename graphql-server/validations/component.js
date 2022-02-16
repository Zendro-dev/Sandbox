// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(component) {

    component.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    component.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "componentName": {
                "type": ["string", "null"]
            },
            "componentType_fk": {
                "type": ["string", "null"]
            },
            "protocol_components_fk": {
                "type": ["array", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    component.prototype.asyncValidate = ajv.compile(
        component.prototype.validatorSchema
    )

    component.prototype.validateForCreate = async function(record) {
        return await component.prototype.asyncValidate(record)
    }

    component.prototype.validateForUpdate = async function(record) {
        return await component.prototype.asyncValidate(record)
    }

    component.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    component.prototype.validateAfterRead = async function(record) {
        return await component.prototype.asyncValidate(record)
    }

    return component
}