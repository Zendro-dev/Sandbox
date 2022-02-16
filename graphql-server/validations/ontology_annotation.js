// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(ontology_annotation) {

    ontology_annotation.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    ontology_annotation.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "annotationValue": {
                "type": ["string", "null"]
            },
            "termSource": {
                "type": ["string", "null"]
            },
            "termAccession": {
                "type": ["string", "null"]
            },
            "assay_unitCategories_fk": {
                "type": ["array", "null"]
            },
            "study_studyDesignDescriptors_fk": {
                "type": ["array", "null"]
            },
            "study_unitCategories_fk": {
                "type": ["array", "null"]
            },
            "person_roles_fk": {
                "type": ["array", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    ontology_annotation.prototype.asyncValidate = ajv.compile(
        ontology_annotation.prototype.validatorSchema
    )

    ontology_annotation.prototype.validateForCreate = async function(record) {
        return await ontology_annotation.prototype.asyncValidate(record)
    }

    ontology_annotation.prototype.validateForUpdate = async function(record) {
        return await ontology_annotation.prototype.asyncValidate(record)
    }

    ontology_annotation.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    ontology_annotation.prototype.validateAfterRead = async function(record) {
        return await ontology_annotation.prototype.asyncValidate(record)
    }

    return ontology_annotation
}