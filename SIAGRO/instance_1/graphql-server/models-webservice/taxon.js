const _ = require('lodash');
const path = require('path');
const models = require(path.join(__dirname, '..', 'models_index.js'));
const axios = require('axios');
const errorHelper = require('../utils/errors');


// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'taxon',
    storageType: 'webservice',
    attributes: {
        id: 'String',
        taxon: 'String',
        categoria: 'String',
        estatus: 'String',
        nombreAutoridad: 'String',
        citaNomenclatural: 'String',
        fuente: 'String',
        ambiente: 'String',
        grupoSNIB: 'String',
        categoriaResidencia: 'String',
        nom: 'String',
        cites: 'String',
        iucn: 'String',
        prioritarias: 'String',
        endemismo: 'String'
    },
    associations: {
        cuadrantes: {
            type: 'to_many',
            target: 'cuadrante',
            targetKey: 'taxon_id',
            keyIn: 'cuadrante',
            targetStorageType: 'sql',
            label: 'nombre_comun_grupo_enfoque',
            name: 'cuadrantes',
            name_lc: 'cuadrantes',
            name_cp: 'Cuadrantes',
            target_lc: 'cuadrante',
            target_lc_pl: 'cuadrantes',
            target_pl: 'cuadrantes',
            target_cp: 'Cuadrante',
            target_cp_pl: 'Cuadrantes',
            keyIn_lc: 'cuadrante',
            holdsForeignKey: false
        }
    },
    internalId: 'id',
    id: {
        name: 'id',
        type: 'String'
    }
};

module.exports = class taxon {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        id,
        taxon,
        categoria,
        estatus,
        nombreAutoridad,
        citaNomenclatural,
        fuente,
        ambiente,
        grupoSNIB,
        categoriaResidencia,
        nom,
        cites,
        iucn,
        prioritarias,
        endemismo
    }) {
        this.id = id;
        this.taxon = taxon;
        this.categoria = categoria;
        this.estatus = estatus;
        this.nombreAutoridad = nombreAutoridad;
        this.citaNomenclatural = citaNomenclatural;
        this.fuente = fuente;
        this.ambiente = ambiente;
        this.grupoSNIB = grupoSNIB;
        this.categoriaResidencia = categoriaResidencia;
        this.nom = nom;
        this.cites = cites;
        this.iucn = iucn;
        this.prioritarias = prioritarias;
        this.endemismo = endemismo;
    }

    static get name() {
        return "taxon";
    }

    static async readById(id) {
    	/**
 	 * Patch: Taxon
 	 */
 	let query = `
       	query
         taxon
         {
           taxon(id:"${id}")
           {
             id
             taxon
             categoria
             estatus
             nombreAutoridad
             citaNomenclatural
             fuente
             ambiente
             grupoSNIB
             categoriaResidencia
             nom
             cites
             iucn
             prioritarias
             endemismo
           }
         }`;
         try {
           // Send an HTTP request to the remote server
           let response = await axios.post("http://zacatuche.conabio.gob.mx:4000/graphql", {query:query});
           // STATUS-CODE is 200
           // NO ERROR as such has been detected by the server (Express)
           // check if data was send
           if (response && response.data && response.data.data) {
             return response.data.data.taxon;
           } else {
             throw new Error(`Invalid response from remote cenz-server: Zacatuche`);
           }
         } catch(error) {
           //handle caught errors
           errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, "http://zacatuche.conabio.gob.mx:4000/graphql");
         }
    } 

    static countRecords(search) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('countTaxons is not implemented');
    }

    static readAll(search, order, pagination) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('Read all taxons is not implemented');

    }

    static readAllCursor(search, order, pagination) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('Read all taxons with cursor based pagination is not implemented');

    }

    static addOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('addTaxon is not implemented');
    }

    static deleteOne(id) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('deleteTaxon is not implemented');
    }

    static updateOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('updateTaxon is not implemented');
    }

    static bulkAddCsv(context) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('bulkAddTaxonCsv is not implemented');
    }

    static csvTableTemplate() {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('csvTableTemplateTaxon is not implemented');
    }

    static get definition() {
        return definition;
    }

    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(taxon.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return taxon.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return taxon.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of taxon.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[taxon.idAttribute()]
    }


};
