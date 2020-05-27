// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(dog) {

    dog.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "name": {
                "type": "string",
                "pattern": "^[a-zA-Z0-9]+$"
            },
            "dog_id": {
                "type": ["string", "null"]
            },
            "person_id": {
                "type": ["string", "null"]
            }
        }
    }

    dog.prototype.asyncValidate = ajv.compile(
        dog.prototype.validatorSchema
    )

    dog.prototype.validateForCreate = async function(record) {
      //throw new Error("NO DOG CAN BE CREATED");
        return await dog.prototype.asyncValidate(record)
    }

    dog.prototype.validateForUpdate = async function(record) {
        return await dog.prototype.asyncValidate(record)
    }

    dog.prototype.validateForDelete = async function(record) {

        //TODO: on the input you have the record to be deleted, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    dog.prototype.validateAfterRead = async function(record) {

        //TODO: on the input you have the record validated, no generic
        // validation checks are available.

        return {
            error: null
        }
    }

    return dog
}
