// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(cultivar) {

    cultivar.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    cultivar.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "description": {
                "type": ["string", "null"]
            },
            "genotype": {
                "type": ["string", "null"]
            },
            "taxon_id": {
                "type": ["integer", "null"]
            }
        }
    }

    cultivar.prototype.asyncValidate = ajv.compile(
        cultivar.prototype.validatorSchema
    )

    cultivar.prototype.validateForCreate = async function(record) {
        return await cultivar.prototype.asyncValidate(record)
    }

    cultivar.prototype.validateForUpdate = async function(record) {
        return await cultivar.prototype.asyncValidate(record)
    }

    cultivar.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    cultivar.prototype.validateAfterRead = async function(record) {
        return await cultivar.prototype.asyncValidate(record)
    }

    return cultivar
}