// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(microbiome_asv) {

    microbiome_asv.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    microbiome_asv.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "asv_id": {
                "type": ["string", "null"]
            },
            "compartment": {
                "type": ["string", "null"]
            },
            "count": {
                "type": ["integer", "null"]
            },
            "version": {
                "type": ["integer", "null"]
            },
            "primer_kingdom": {
                "type": ["string", "null"]
            },
            "reference_gene": {
                "type": ["string", "null"]
            },
            "reference_sequence": {
                "type": ["string", "null"]
            },
            "sample_id": {
                "type": ["integer", "null"]
            },
            "taxon_id": {
                "type": ["integer", "null"]
            }
        }
    }

    microbiome_asv.prototype.asyncValidate = ajv.compile(
        microbiome_asv.prototype.validatorSchema
    )

    microbiome_asv.prototype.validateForCreate = async function(record) {
        return await microbiome_asv.prototype.asyncValidate(record)
    }

    microbiome_asv.prototype.validateForUpdate = async function(record) {
        return await microbiome_asv.prototype.asyncValidate(record)
    }

    microbiome_asv.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    microbiome_asv.prototype.validateAfterRead = async function(record) {
        return await microbiome_asv.prototype.asyncValidate(record)
    }

    return microbiome_asv
}