// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(sPARefactor) {

    sPARefactor.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    sPARefactor.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "array": {
                "type": ["array", "null"]
            },
            "string": {
                "type": ["string", "null"]
            },
            "int": {
                "type": ["integer", "string"]
            },
            "float": {
                "type": ["number", "null"]
            },
            "date": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "time": {
                "anyOf": [{
                    "isoTime": true
                }, {
                    "type": "null"
                }]
            },
            "datetime": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            }
        }
    }

    sPARefactor.prototype.asyncValidate = ajv.compile(
        sPARefactor.prototype.validatorSchema
    )

    sPARefactor.prototype.validateForCreate = async function(record) {
        return await sPARefactor.prototype.asyncValidate(record)
    }

    sPARefactor.prototype.validateForUpdate = async function(record) {
        return await sPARefactor.prototype.asyncValidate(record)
    }

    sPARefactor.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    sPARefactor.prototype.validateAfterRead = async function(record) {
        return await sPARefactor.prototype.asyncValidate(record)
    }

    return sPARefactor
}