// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(material) {

    material.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    material.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "material_id": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "type": {
                "type": ["string", "null"]
            },
            "study_ids": {
                "type": ["array", "null"]
            },
            "assay_ids": {
                "type": ["array", "null"]
            },
            "ontologyAnnotation_ids": {
                "type": ["array", "null"]
            },
            "sourceSet_ids": {
                "type": ["array", "null"]
            },
            "element_ids": {
                "type": ["array", "null"]
            }
        }
    }

    material.prototype.asyncValidate = ajv.compile(
        material.prototype.validatorSchema
    )

    material.prototype.validateForCreate = async function(record) {
        return await material.prototype.asyncValidate(record)
    }

    material.prototype.validateForUpdate = async function(record) {
        return await material.prototype.asyncValidate(record)
    }

    material.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    material.prototype.validateAfterRead = async function(record) {
        return await material.prototype.asyncValidate(record)
    }

    return material
}