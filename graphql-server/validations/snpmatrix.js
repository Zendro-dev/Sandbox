// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(snpmatrix) {

    snpmatrix.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    snpmatrix.prototype.validatorSchema = {
        "$async": true,
        "type": "object",
        "properties": {
            "snp_matrix_id": {
                "type": ["integer", "null"]
            },
            "int_array": {
                "type": ["array", "null"]
            }
        }
    }

    snpmatrix.prototype.asyncValidate = ajv.compile(
        snpmatrix.prototype.validatorSchema
    )

    snpmatrix.prototype.validateForCreate = async function(record) {
        return await snpmatrix.prototype.asyncValidate(record)
    }

    snpmatrix.prototype.validateForUpdate = async function(record) {
        return await snpmatrix.prototype.asyncValidate(record)
    }

    snpmatrix.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    snpmatrix.prototype.validateAfterRead = async function(record) {
        return await snpmatrix.prototype.asyncValidate(record)
    }

    return snpmatrix
}