// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(comment) {

    comment.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    comment.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "value": {
                "type": ["string", "null"]
            },
            "assay_comments_fk": {
                "type": ["string", "null"]
            },
            "ontology_annotation_comments_fk": {
                "type": ["string", "null"]
            },
            "data_comments_fk": {
                "type": ["string", "null"]
            },
            "process_comments_fk": {
                "type": ["string", "null"]
            },
            "ontology_source_reference_comments_fk": {
                "type": ["string", "null"]
            },
            "person_comments_fk": {
                "type": ["string", "null"]
            },
            "publication_comments_fk": {
                "type": ["string", "null"]
            },
            "investigation_comments_fk": {
                "type": ["string", "null"]
            },
            "factor_comments_fk": {
                "type": ["string", "null"]
            },
            "study_comments_fk": {
                "type": ["string", "null"]
            },
            "protocol_comments_fk": {
                "type": ["string", "null"]
            },
            "protocol_parameter_comments_fk": {
                "type": ["string", "null"]
            },
            "material_comments_fk": {
                "type": ["string", "null"]
            },
            "source_comments_fk": {
                "type": ["string", "null"]
            },
            "material_attribute_value_comments_fk": {
                "type": ["string", "null"]
            },
            "factor_value_comments_fk": {
                "type": ["string", "null"]
            },
            "process_parameter_value_comments_fk": {
                "type": ["string", "null"]
            },
            "sample_comments_fk": {
                "type": ["string", "null"]
            },
            "component_comments_fk": {
                "type": ["string", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    comment.prototype.asyncValidate = ajv.compile(
        comment.prototype.validatorSchema
    )

    comment.prototype.validateForCreate = async function(record) {
        return await comment.prototype.asyncValidate(record)
    }

    comment.prototype.validateForUpdate = async function(record) {
        return await comment.prototype.asyncValidate(record)
    }

    comment.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    comment.prototype.validateAfterRead = async function(record) {
        return await comment.prototype.asyncValidate(record)
    }

    return comment
}