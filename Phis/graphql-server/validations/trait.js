// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(trait) {

    trait.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "attribute": {
                "type": ["string", "null"]
            },
            "entity": {
                "type": ["string", "null"]
            },
            "mainAbbreviation": {
                "type": ["string", "null"]
            },
            "status": {
                "type": ["string", "null"]
            },
            "traitClass": {
                "type": ["string", "null"]
            },
            "traitDescription": {
                "type": ["string", "null"]
            },
            "traitName": {
                "type": ["string", "null"]
            },
            "xref": {
                "type": ["string", "null"]
            },
            "traitDbId": {
                "type": ["string", "null"]
            },
            "ontologyDbId": {
                "type": ["string", "null"]
            }
        }
    }

    trait.prototype.asyncValidate = ajv.compile(
        trait.prototype.validatorSchema
    )

    trait.prototype.validateForCreate = async function(record) {
        return await trait.prototype.asyncValidate(record)
    }

    trait.prototype.validateForUpdate = async function(record) {
        return await trait.prototype.asyncValidate(record)
    }

    trait.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    trait.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return trait
}