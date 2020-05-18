// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(observationUnitPosition) {

    observationUnitPosition.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "blockNumber": {
                "type": ["string", "null"]
            },
            "entryNumber": {
                "type": ["string", "null"]
            },
            "positionCoordinateX": {
                "type": ["string", "null"]
            },
            "positionCoordinateY": {
                "type": ["string", "null"]
            },
            "replicate": {
                "type": ["string", "null"]
            },
            "observationUnitDbId": {
                "type": ["string", "null"]
            },
            "observationUnitPositionDbId": {
                "type": ["string", "null"]
            }
        }
    }

    observationUnitPosition.prototype.asyncValidate = ajv.compile(
        observationUnitPosition.prototype.validatorSchema
    )

    observationUnitPosition.prototype.validateForCreate = async function(record) {
        return await observationUnitPosition.prototype.asyncValidate(record)
    }

    observationUnitPosition.prototype.validateForUpdate = async function(record) {
        return await observationUnitPosition.prototype.asyncValidate(record)
    }

    observationUnitPosition.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    observationUnitPosition.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return observationUnitPosition
}