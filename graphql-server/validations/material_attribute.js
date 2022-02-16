// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(material_attribute) {

    material_attribute.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    material_attribute.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "characteristicType_fk": {
                "type": ["string", "null"]
            },
            "assay_characteristicCategories_fk": {
                "type": ["array", "null"]
            },
            "study_characteristicCategories_fk": {
                "type": ["array", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    material_attribute.prototype.asyncValidate = ajv.compile(
        material_attribute.prototype.validatorSchema
    )

    material_attribute.prototype.validateForCreate = async function(record) {
        return await material_attribute.prototype.asyncValidate(record)
    }

    material_attribute.prototype.validateForUpdate = async function(record) {
        return await material_attribute.prototype.asyncValidate(record)
    }

    material_attribute.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    material_attribute.prototype.validateAfterRead = async function(record) {
        return await material_attribute.prototype.asyncValidate(record)
    }

    return material_attribute
}