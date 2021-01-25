// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(no_assoc) {

    no_assoc.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    no_assoc.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "idField": {
                "type": ["string", "null"]
            },
            "stringField": {
                "type": ["string", "null"]
            },
            "intField": {
                "type": ["integer", "null"]
            },
            "floatField": {
                "type": ["number", "null"]
            },
            "datetimeField": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "booleanField": {
                "type": ["boolean", "null"]
            },
            "stringArrayField": {
                "type": ["array", "null"]
            },
            "intArrayField": {
                "type": ["array", "null"]
            },
            "floatArrayField": {
                "type": ["array", "null"]
            },
            "datetimeArrayField": {
                "type": ["array", "null"]
            },
            "booleanArrayField": {
                "type": ["array", "null"]
            }
        }
    }

    no_assoc.prototype.asyncValidate = ajv.compile(
        no_assoc.prototype.validatorSchema
    )

    no_assoc.prototype.validateForCreate = async function(record) {
        return await no_assoc.prototype.asyncValidate(record)
    }

    no_assoc.prototype.validateForUpdate = async function(record) {
        return await no_assoc.prototype.asyncValidate(record)
    }

    no_assoc.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    no_assoc.prototype.validateAfterRead = async function(record) {
        return await no_assoc.prototype.asyncValidate(record)
    }

    return no_assoc
}