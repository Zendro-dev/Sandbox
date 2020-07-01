// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(plant_variant) {

    plant_variant.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "genotype": {
                "type": ["string", "null"]
            },
            "disease_resistances": {
                "type": ["string", "null"]
            },
            "plant_variant_ID": {
                "type": ["string", "null"]
            }
        }
    }

    plant_variant.prototype.asyncValidate = ajv.compile(
        plant_variant.prototype.validatorSchema
    )

    plant_variant.prototype.validateForCreate = async function(record) {
        return await plant_variant.prototype.asyncValidate(record)
    }

    plant_variant.prototype.validateForUpdate = async function(record) {
        return await plant_variant.prototype.asyncValidate(record)
    }

    plant_variant.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    plant_variant.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return plant_variant
}