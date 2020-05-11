// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(image) {

    image.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "copyright": {
                "type": ["string", "null"]
            },
            "description": {
                "type": ["string", "null"]
            },
            "imageFileName": {
                "type": ["string", "null"]
            },
            "imageFileSize": {
                "type": ["integer", "null"]
            },
            "imageHeight": {
                "type": ["integer", "null"]
            },
            "imageName": {
                "type": ["string", "null"]
            },
            "imageTimeStamp": {
                "anyOf": [{
                    "isoDateTime": true
                }, {
                    "type": "null"
                }]
            },
            "imageURL": {
                "type": ["string", "null"]
            },
            "imageWidth": {
                "type": ["integer", "null"]
            },
            "mimeType": {
                "type": ["string", "null"]
            },
            "observationUnitDbId": {
                "type": ["string", "null"]
            },
            "imageDbId": {
                "type": ["string", "null"]
            }
        }
    }

    image.prototype.asyncValidate = ajv.compile(
        image.prototype.validatorSchema
    )

    image.prototype.validateForCreate = async function(record) {
        return await image.prototype.asyncValidate(record)
    }

    image.prototype.validateForUpdate = async function(record) {
        return await image.prototype.asyncValidate(record)
    }

    image.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }
    return image
}