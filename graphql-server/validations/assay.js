// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(assay) {

    assay.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    assay.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "filename": {
                "type": ["string", "null"]
            },
            "measurementType_fk": {
                "type": ["string", "null"]
            },
            "technologyType_fk": {
                "type": ["string", "null"]
            },
            "technologyPlatform": {
                "type": ["string", "null"]
            },
            "materials_samples_fk": {
                "type": ["array", "null"]
            },
            "materials_otherMaterials_fk": {
                "type": ["array", "null"]
            },
            "characteristicCategories_fk": {
                "type": ["array", "null"]
            },
            "unitCategories_fk": {
                "type": ["array", "null"]
            },
            "study_assays_fk": {
                "type": ["string", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    assay.prototype.asyncValidate = ajv.compile(
        assay.prototype.validatorSchema
    )

    assay.prototype.validateForCreate = async function(record) {
        return await assay.prototype.asyncValidate(record)
    }

    assay.prototype.validateForUpdate = async function(record) {
        return await assay.prototype.asyncValidate(record)
    }

    assay.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    assay.prototype.validateAfterRead = async function(record) {
        return await assay.prototype.asyncValidate(record)
    }

    return assay
}