// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(ontologyAnnotation) {

    ontologyAnnotation.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    ontologyAnnotation.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "ontologyAnnotation_id": {
                "type": ["string", "null"]
            },
            "ontology": {
                "type": ["string", "null"]
            },
            "ontologyURL": {
                "type": ["string", "null"]
            },
            "term": {
                "type": ["string", "null"]
            },
            "termURL": {
                "type": ["string", "null"]
            },
            "investigation_ids": {
                "type": ["array", "null"]
            },
            "study_ids": {
                "type": ["array", "null"]
            },
            "assay_ids": {
                "type": ["array", "null"]
            },
            "factor_ids": {
                "type": ["array", "null"]
            },
            "material_ids": {
                "type": ["array", "null"]
            },
            "protocol_ids": {
                "type": ["array", "null"]
            },
            "contact_ids": {
                "type": ["array", "null"]
            }
        }
    }

    ontologyAnnotation.prototype.asyncValidate = ajv.compile(
        ontologyAnnotation.prototype.validatorSchema
    )

    ontologyAnnotation.prototype.validateForCreate = async function(record) {
        return await ontologyAnnotation.prototype.asyncValidate(record)
    }

    ontologyAnnotation.prototype.validateForUpdate = async function(record) {
        return await ontologyAnnotation.prototype.asyncValidate(record)
    }

    ontologyAnnotation.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    ontologyAnnotation.prototype.validateAfterRead = async function(record) {
        return await ontologyAnnotation.prototype.asyncValidate(record)
    }

    return ontologyAnnotation
}