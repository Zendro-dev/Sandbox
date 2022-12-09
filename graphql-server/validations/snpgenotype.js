// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(snpgenotype) {

    snpgenotype.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    snpgenotype.prototype.validatorSchema = {
        "$async": true,
        "type": "object",
        "properties": {
            "snp_matrix_id": {
                "type": ["integer", "null"]
            },
            "material_id": {
                "type": ["string", "null"]
            },
            "row_number": {
                "type": ["integer", "null"]
            }
        }
    }

    snpgenotype.prototype.asyncValidate = ajv.compile(
        snpgenotype.prototype.validatorSchema
    )

    snpgenotype.prototype.validateForCreate = async function(record) {
        return await snpgenotype.prototype.asyncValidate(record)
    }

    snpgenotype.prototype.validateForUpdate = async function(record) {
        return await snpgenotype.prototype.asyncValidate(record)
    }

    snpgenotype.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    snpgenotype.prototype.validateAfterRead = async function(record) {
        return await snpgenotype.prototype.asyncValidate(record)
    }

    return snpgenotype
}