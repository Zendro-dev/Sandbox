// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(event) {

    event.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "eventDbId": {
                "type": ["string", "null"]
            },
            "eventDescription": {
                "type": ["string", "null"]
            },
            "eventType": {
                "type": ["string", "null"]
            },
            "studyDbId": {
                "type": ["string", "null"]
            },
            "date": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            }
        }
    }

    event.prototype.asyncValidate = ajv.compile(
        event.prototype.validatorSchema
    )

    event.prototype.validateForCreate = async function(record) {
        return await event.prototype.asyncValidate(record)
    }

    event.prototype.validateForUpdate = async function(record) {
        return await event.prototype.asyncValidate(record)
    }

    event.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    event.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return event
}