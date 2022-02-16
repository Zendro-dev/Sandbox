// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(study) {

    study.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    study.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "filename": {
                "type": ["string", "null"]
            },
            "identifier": {
                "type": ["string", "null"]
            },
            "title": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "submissionDate": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "publicReleaseDate": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "publications_fk": {
                "type": ["array", "null"]
            },
            "people_fk": {
                "type": ["array", "null"]
            },
            "studyDesignDescriptors_fk": {
                "type": ["array", "null"]
            },
            "protocols_fk": {
                "type": ["array", "null"]
            },
            "materials_sources_fk": {
                "type": ["array", "null"]
            },
            "materials_samples_fk": {
                "type": ["array", "null"]
            },
            "materials_otherMaterials_fk": {
                "type": ["array", "null"]
            },
            "processSequence_fk": {
                "type": ["array", "null"]
            },
            "assays_fk": {
                "type": ["array", "null"]
            },
            "factors_fk": {
                "type": ["array", "null"]
            },
            "characteristicCategories_fk": {
                "type": ["array", "null"]
            },
            "unitCategories_fk": {
                "type": ["array", "null"]
            },
            "investigation_studies_fk": {
                "type": ["string", "null"]
            },
            "id": {
                "type": ["string", "null"]
            }
        }
    }

    study.prototype.asyncValidate = ajv.compile(
        study.prototype.validatorSchema
    )

    study.prototype.validateForCreate = async function(record) {
        return await study.prototype.asyncValidate(record)
    }

    study.prototype.validateForUpdate = async function(record) {
        return await study.prototype.asyncValidate(record)
    }

    study.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    study.prototype.validateAfterRead = async function(record) {
        return await study.prototype.asyncValidate(record)
    }

    return study
}