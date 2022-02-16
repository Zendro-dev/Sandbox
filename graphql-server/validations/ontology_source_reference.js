// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(ontology_source_reference) {

    ontology_source_reference.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    ontology_source_reference.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "description": {
                "type": ["string", "null"]
            },
            "file": {
                "type": ["string", "null"]
            },
            "name": {
                "type": ["string", "null"]
            },
            "version": {
                "type": ["string", "null"]
            },
            "investigation_ontologySourceReferences_fk": {
                "type": ["string", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    ontology_source_reference.prototype.asyncValidate = ajv.compile(
        ontology_source_reference.prototype.validatorSchema
    )

    ontology_source_reference.prototype.validateForCreate = async function(record) {
        return await ontology_source_reference.prototype.asyncValidate(record)
    }

    ontology_source_reference.prototype.validateForUpdate = async function(record) {
        return await ontology_source_reference.prototype.asyncValidate(record)
    }

    ontology_source_reference.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    ontology_source_reference.prototype.validateAfterRead = async function(record) {
        return await ontology_source_reference.prototype.asyncValidate(record)
    }

    return ontology_source_reference
}