// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(accession) {

    accession.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "accession_id": {
                "type": ["string", "null"]
            },
            "collectors_name": {
                "type": "string",
                "pattern": "^[a-zA-Z0-9]+$"
            },
            "collectors_initials": {
                "type": ["string", "null"]
            },
            "sampling_date": {
                "anyOf": [{
                    "isoDate": true
                }, {
                    "type": "null"
                }]
            },
            "locationId": {
                "type": ["string", "null"]
            }
        }
    }

    accession.prototype.asyncValidate = ajv.compile(
        accession.prototype.validatorSchema
    )

    accession.prototype.validateForCreate = async function(record) {
        return await accession.prototype.asyncValidate(record)
    }

    accession.prototype.validateForUpdate = async function(record) {
        return await accession.prototype.asyncValidate(record)
    }

    accession.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    accession.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return accession
}
