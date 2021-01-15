// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(geneExpression) {

    geneExpression.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    geneExpression.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "gene_id": {
                "type": ["string", "null"]
            },
            "assay_id": {
                "type": ["string", "null"]
            },
            "geneCount": {
                "type": ["string", "null"]
            }
        }
    }

    geneExpression.prototype.asyncValidate = ajv.compile(
        geneExpression.prototype.validatorSchema
    )

    geneExpression.prototype.validateForCreate = async function(record) {
        return await geneExpression.prototype.asyncValidate(record)
    }

    geneExpression.prototype.validateForUpdate = async function(record) {
        return await geneExpression.prototype.asyncValidate(record)
    }

    geneExpression.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    geneExpression.prototype.validateAfterRead = async function(record) {
        return await geneExpression.prototype.asyncValidate(record)
    }

    return geneExpression
}