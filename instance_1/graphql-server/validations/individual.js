// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(individual) {

    individual.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    individual.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": ["string", "null"]
            },
            "sowing_date": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "harvest_date": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "developmental_state": {
                "type": ["string", "null"]
            },
            "life_cycle_phase": {
                "type": ["string", "null"]
            },
            "location_type": {
                "type": ["string", "null"]
            },
            "cultivar_id": {
                "type": ["integer", "null"]
            },
            "field_plot_id": {
                "type": ["integer", "null"]
            },
            "pot_id": {
                "type": ["integer", "null"]
            }
        }
    }

    individual.prototype.asyncValidate = ajv.compile(
        individual.prototype.validatorSchema
    )

    individual.prototype.validateForCreate = async function(record) {
        return await individual.prototype.asyncValidate(record)
    }

    individual.prototype.validateForUpdate = async function(record) {
        return await individual.prototype.asyncValidate(record)
    }

    individual.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    individual.prototype.validateAfterRead = async function(record) {
        return await individual.prototype.asyncValidate(record)
    }

    return individual
}