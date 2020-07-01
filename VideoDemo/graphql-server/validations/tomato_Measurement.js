// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(tomato_Measurement) {

    tomato_Measurement.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "tomato_ID": {
                "type": ["string", "null"]
            },
            "no_fruit": {
                "type": ["integer", "null"],
                "maximum": 100,
                "minimum": 0
            },
            "sugar_content": {
                "type": ["number", "null"],
                "maximum": 10,
                "minimum": 0
            },
            "plant_variant_ID": {
                "type": ["string", "null"]
            }
        }
    }

    tomato_Measurement.prototype.asyncValidate = ajv.compile(
        tomato_Measurement.prototype.validatorSchema
    )

    tomato_Measurement.prototype.validateForCreate = async function(record) {
        return await tomato_Measurement.prototype.asyncValidate(record)
    }

    tomato_Measurement.prototype.validateForUpdate = async function(record) {
        return await tomato_Measurement.prototype.asyncValidate(record)
    }

    tomato_Measurement.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    tomato_Measurement.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return tomato_Measurement
}