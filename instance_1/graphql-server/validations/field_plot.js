// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(field_plot) {

    field_plot.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    field_plot.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "field_name": {
                "type": ["string", "null"]
            },
            "latitude": {
                "type": ["number", "null"]
            },
            "longitude": {
                "type": ["number", "null"]
            },
            "location_code": {
                "type": ["string", "null"]
            },
            "soil_treatment": {
                "type": ["string", "null"]
            }
        }
    }

    field_plot.prototype.asyncValidate = ajv.compile(
        field_plot.prototype.validatorSchema
    )

    field_plot.prototype.validateForCreate = async function(record) {
        return await field_plot.prototype.asyncValidate(record)
    }

    field_plot.prototype.validateForUpdate = async function(record) {
        return await field_plot.prototype.asyncValidate(record)
    }

    field_plot.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    field_plot.prototype.validateAfterRead = async function(record) {
        return await field_plot.prototype.asyncValidate(record)
    }

    return field_plot
}