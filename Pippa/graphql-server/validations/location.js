// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(location) {

    location.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "abbreviation": {
                "type": ["string", "null"]
            },
            "coordinateDescription": {
                "type": ["string", "null"]
            },
            "countryCode": {
                "type": ["string", "null"]
            },
            "countryName": {
                "type": ["string", "null"]
            },
            "documentationURL": {
                "type": ["string", "null"]
            },
            "environmentType": {
                "type": ["string", "null"]
            },
            "exposure": {
                "type": ["string", "null"]
            },
            "instituteAddress": {
                "type": ["string", "null"]
            },
            "instituteName": {
                "type": ["string", "null"]
            },
            "locationName": {
                "type": ["string", "null"]
            },
            "locationType": {
                "type": ["string", "null"]
            },
            "siteStatus": {
                "type": ["string", "null"]
            },
            "slope": {
                "type": ["string", "null"]
            },
            "topography": {
                "type": ["string", "null"]
            },
            "locationDbId": {
                "type": ["string", "null"]
            }
        }
    }

    location.prototype.asyncValidate = ajv.compile(
        location.prototype.validatorSchema
    )

    location.prototype.validateForCreate = async function(record) {
        return await location.prototype.asyncValidate(record)
    }

    location.prototype.validateForUpdate = async function(record) {
        return await location.prototype.asyncValidate(record)
    }

    location.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    location.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return location
}