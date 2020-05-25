const _ = require('lodash');
const path = require('path');
const models = require(path.join(__dirname, '..', 'models_index.js'));

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'aminoacidsequence',
    storageType: 'Webservice',
    attributes: {
        accession: 'String',
        sequence: 'String'
    },
    associations: {
        transcript_counts: {
            type: 'to_many',
            target: 'transcript_count',
            targetKey: 'aminoacidsequence_id',
            keyIn: 'transcript_count',
            targetStorageType: 'sql',
            name: 'transcript_counts',
            name_lc: 'transcript_counts',
            name_cp: 'Transcript_counts',
            target_lc: 'transcript_count',
            target_lc_pl: 'transcript_counts',
            target_pl: 'transcript_counts',
            target_cp: 'Transcript_count',
            target_cp_pl: 'Transcript_counts',
            keyIn_lc: 'transcript_count',
            holdsForeignKey: false
        }
    },
    id: {
        name: 'id',
        type: 'Int'
    }
};

module.exports = class aminoacidsequence {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        id,
        accession,
        sequence
    }) {
        this.id = id;
        this.accession = accession;
        this.sequence = sequence;
    }

    static get name() {
        return "aminoacidsequence";
    }

    static readById(id) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('readOneAminoacidsequence is not implemented');
    }

    static countRecords(search) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('countAminoacidsequences is not implemented');
    }

    static readAll(search, order, pagination) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('Read all aminoacidsequences is not implemented');

    }

    static readAllCursor(search, order, pagination) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('Read all aminoacidsequences with cursor based pagination is not implemented');

    }

    static addOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('addAminoacidsequence is not implemented');
    }

    static deleteOne(id) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('deleteAminoacidsequence is not implemented');
    }

    static updateOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('updateAminoacidsequence is not implemented');
    }

    static bulkAddCsv(context) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('bulkAddAminoacidsequenceCsv is not implemented');
    }

    static csvTableTemplate() {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('csvTableTemplateAminoacidsequence is not implemented');
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
        let attributes = Object.keys(aminoacidsequence.definition.attributes);
        attributes.push('id');
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return aminoacidsequence.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return aminoacidsequence.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of aminoacidsequence.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[aminoacidsequence.idAttribute()]
    }


};