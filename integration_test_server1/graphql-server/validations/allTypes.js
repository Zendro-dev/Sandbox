// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(allTypes) {

    allTypes.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    allTypes.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "record_id": {
                "type": ["string", "null"]
            },
            "record_date": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "record_date_time": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "record_time": {
                "anyOf": [{
                    "isoTime": true
                }, {
                    "type": "null"
                }]
            },
            "record_int": {
                "type": ["integer", "null"]
            },
            "record_boolean": {
                "type": ["boolean", "null"]
            },
            "record_float": {
                "type": ["number", "null"]
            },
            "record_string": {
                "type": ["string", "null"]
            }
        }
    }

    allTypes.prototype.asyncValidate = ajv.compile(
        allTypes.prototype.validatorSchema
    )

    allTypes.prototype.validateForCreate = async function(record) {
        return await allTypes.prototype.asyncValidate(record)
    }

    allTypes.prototype.validateForUpdate = async function(record) {
        return await allTypes.prototype.asyncValidate(record)
    }

    allTypes.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    allTypes.prototype.validateAfterRead = async function(record) {
        return await allTypes.prototype.asyncValidate(record)
    }

    return allTypes
}