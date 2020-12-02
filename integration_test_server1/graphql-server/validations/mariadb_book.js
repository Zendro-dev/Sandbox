// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
}))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(mariadb_book) {

    mariadb_book.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    mariadb_book.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "title": {
                "type": ["string", "null"]
            },
            "genre": {
                "type": ["string", "null"]
            },
            "ISBN": {
                "type": ["string", "null"]
            }
        }
    }

    mariadb_book.prototype.asyncValidate = ajv.compile(
        mariadb_book.prototype.validatorSchema
    )

    mariadb_book.prototype.validateForCreate = async function(record) {
        return await mariadb_book.prototype.asyncValidate(record)
    }

    mariadb_book.prototype.validateForUpdate = async function(record) {
        return await mariadb_book.prototype.asyncValidate(record)
    }

    mariadb_book.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    mariadb_book.prototype.validateAfterRead = async function(record) {
        return await mariadb_book.prototype.asyncValidate(record)
    }

    return mariadb_book
}