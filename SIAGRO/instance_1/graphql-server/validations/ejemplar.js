// Delete this file, if you do not want or need any validations.
const validatorUtil = require('../utils/validatorUtil')
const Ajv = require('ajv')
const ajv = validatorUtil.addValidatorFunc(validatorUtil.addDateTimeAjvKeywords(new Ajv({
    allErrors: true
})))

// Dear user, edit the schema to adjust it to your model
module.exports.validator_patch = function(ejemplar) {

    ejemplar.prototype.validationControl = {
        validateForCreate: true,
        validateForUpdate: true,
        validateForDelete: false,
        validateAfterRead: false
    }

    ejemplar.prototype.validatorSchema = {
        "$async": true,
        "properties": {
            "id": {
                "type": ["string", "null"]
            },
            "region": {
                "type": ["string", "null"]
            },
            "localidad": {
                "type": ["string", "null"]
            },
            "longitud": {
                "type": ["number", "null"]
            },
            "latitud": {
                "type": ["number", "null"]
            },
            "datum": {
                "type": ["string", "null"]
            },
            "validacionambiente": {
                "type": ["string", "null"]
            },
            "geovalidacion": {
                "type": ["string", "null"]
            },
            "paismapa": {
                "type": ["string", "null"]
            },
            "estadomapa": {
                "type": ["string", "null"]
            },
            "claveestadomapa": {
                "type": ["string", "null"]
            },
            "mt24nombreestadomapa": {
                "type": ["string", "null"]
            },
            "mt24claveestadomapa": {
                "type": ["string", "null"]
            },
            "municipiomapa": {
                "type": ["string", "null"]
            },
            "clavemunicipiomapa": {
                "type": ["string", "null"]
            },
            "mt24nombremunicipiomapa": {
                "type": ["string", "null"]
            },
            "mt24clavemunicipiomapa": {
                "type": ["string", "null"]
            },
            "incertidumbrexy": {
                "type": ["string", "null"]
            },
            "altitudmapa": {
                "type": ["string", "null"]
            },
            "usvserieI": {
                "type": ["string", "null"]
            },
            "usvserieII": {
                "type": ["string", "null"]
            },
            "usvserieIII": {
                "type": ["string", "null"]
            },
            "usvserieIV": {
                "type": ["string", "null"]
            },
            "usvserieV": {
                "type": ["string", "null"]
            },
            "usvserieVI": {
                "type": ["string", "null"]
            },
            "anp": {
                "type": ["string", "null"]
            },
            "grupobio": {
                "type": ["string", "null"]
            },
            "subgrupobio": {
                "type": ["string", "null"]
            },
            "taxon": {
                "type": ["string", "null"]
            },
            "autor": {
                "type": ["string", "null"]
            },
            "estatustax": {
                "type": ["string", "null"]
            },
            "reftax": {
                "type": ["string", "null"]
            },
            "taxonvalido": {
                "type": ["string", "null"]
            },
            "autorvalido": {
                "type": ["string", "null"]
            },
            "reftaxvalido": {
                "type": ["string", "null"]
            },
            "taxonvalidado": {
                "type": ["string", "null"]
            },
            "endemismo": {
                "type": ["string", "null"]
            },
            "taxonextinto": {
                "type": ["string", "null"]
            },
            "ambiente": {
                "type": ["string", "null"]
            },
            "nombrecomun": {
                "type": ["string", "null"]
            },
            "formadecrecimiento": {
                "type": ["string", "null"]
            },
            "prioritaria": {
                "type": ["string", "null"]
            },
            "nivelprioridad": {
                "type": ["string", "null"]
            },
            "exoticainvasora": {
                "type": ["string", "null"]
            },
            "nom059": {
                "type": ["string", "null"]
            },
            "cites": {
                "type": ["string", "null"]
            },
            "iucn": {
                "type": ["string", "null"]
            },
            "categoriaresidenciaaves": {
                "type": ["string", "null"]
            },
            "probablelocnodecampo": {
                "type": ["string", "null"]
            },
            "obsusoinfo": {
                "type": ["string", "null"]
            },
            "coleccion": {
                "type": ["string", "null"]
            },
            "institucion": {
                "type": ["string", "null"]
            },
            "paiscoleccion": {
                "type": ["string", "null"]
            },
            "numcatalogo": {
                "type": ["string", "null"]
            },
            "numcolecta": {
                "type": ["string", "null"]
            },
            "procedenciaejemplar": {
                "type": ["string", "null"]
            },
            "determinador": {
                "type": ["string", "null"]
            },
            "aniodeterminacion": {
                "type": ["string", "null"]
            },
            "mesdeterminacion": {
                "type": ["string", "null"]
            },
            "diadeterminacion": {
                "type": ["string", "null"]
            },
            "fechadeterminacion": {
                "type": ["string", "null"]
            },
            "calificadordeterminacion": {
                "type": ["string", "null"]
            },
            "colector": {
                "type": ["string", "null"]
            },
            "aniocolecta": {
                "type": ["string", "null"]
            },
            "mescolecta": {
                "type": ["string", "null"]
            },
            "diacolecta": {
                "type": ["string", "null"]
            },
            "fechacolecta": {
                "type": ["string", "null"]
            },
            "tipo": {
                "type": ["string", "null"]
            },
            "ejemplarfosil": {
                "type": ["string", "null"]
            },
            "proyecto": {
                "type": ["string", "null"]
            },
            "fuente": {
                "type": ["string", "null"]
            },
            "formadecitar": {
                "type": ["string", "null"]
            },
            "licenciauso": {
                "type": ["string", "null"]
            },
            "urlproyecto": {
                "type": ["string", "null"]
            },
            "urlorigen": {
                "type": ["string", "null"]
            },
            "urlejemplar": {
                "type": ["string", "null"]
            },
            "ultimafechaactualizacion": {
                "type": ["string", "null"]
            },
            "cuarentena": {
                "type": ["string", "null"]
            },
            "version": {
                "type": ["string", "null"]
            },
            "especie": {
                "type": ["string", "null"]
            },
            "especievalida": {
                "type": ["string", "null"]
            },
            "especievalidabusqueda": {
                "type": ["string", "null"]
            }
        }
    }

    ejemplar.prototype.asyncValidate = ajv.compile(
        ejemplar.prototype.validatorSchema
    )

    ejemplar.prototype.validateForCreate = async function(record) {
        return await ejemplar.prototype.asyncValidate(record)
    }

    ejemplar.prototype.validateForUpdate = async function(record) {
        return await ejemplar.prototype.asyncValidate(record)
    }

    ejemplar.prototype.validateForDelete = async function(id) {

        //TODO: on the input you have the id of the record to be deleted, no generic
        // validation checks are available. You might need to import the correspondant model
        // in order to read the whole record info and the do the validation.

        return {
            error: null
        }
    }

    ejemplar.prototype.validateAfterRead = async function(record) {
        return await ejemplar.prototype.asyncValidate(record)
    }

    return ejemplar
}