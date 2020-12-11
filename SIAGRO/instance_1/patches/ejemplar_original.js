const _ = require('lodash');
const globals = require('../../config/globals');
const helper = require('../../utils/helper');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'Ejemplar',
    storageType: 'generic',
    attributes: {
        id: 'String',
        region: 'String',
        localidad: 'String',
        longitud: 'Float',
        latitud: 'Float',
        datum: 'String',
        validacionambiente: 'String',
        geovalidacion: 'String',
        paismapa: 'String',
        estadomapa: 'String',
        claveestadomapa: 'String',
        mt24nombreestadomapa: 'String',
        mt24claveestadomapa: 'String',
        municipiomapa: 'String',
        clavemunicipiomapa: 'String',
        mt24nombremunicipiomapa: 'String',
        mt24clavemunicipiomapa: 'String',
        incertidumbrexy: 'String',
        altitudmapa: 'String',
        usvserieI: 'String',
        usvserieII: 'String',
        usvserieIII: 'String',
        usvserieIV: 'String',
        usvserieV: 'String',
        usvserieVI: 'String',
        anp: 'String',
        grupobio: 'String',
        subgrupobio: 'String',
        taxon: 'String',
        autor: 'String',
        estatustax: 'String',
        reftax: 'String',
        taxonvalido: 'String',
        autorvalido: 'String',
        reftaxvalido: 'String',
        taxonvalidado: 'String',
        endemismo: 'String',
        taxonextinto: 'String',
        ambiente: 'String',
        nombrecomun: 'String',
        formadecrecimiento: 'String',
        prioritaria: 'String',
        nivelprioridad: 'String',
        exoticainvasora: 'String',
        nom059: 'String',
        cites: 'String',
        iucn: 'String',
        categoriaresidenciaaves: 'String',
        probablelocnodecampo: 'String',
        obsusoinfo: 'String',
        coleccion: 'String',
        institucion: 'String',
        paiscoleccion: 'String',
        numcatalogo: 'String',
        numcolecta: 'String',
        procedenciaejemplar: 'String',
        determinador: 'String',
        aniodeterminacion: 'String',
        mesdeterminacion: 'String',
        diadeterminacion: 'String',
        fechadeterminacion: 'String',
        calificadordeterminacion: 'String',
        colector: 'String',
        aniocolecta: 'String',
        mescolecta: 'String',
        diacolecta: 'String',
        fechacolecta: 'String',
        tipo: 'String',
        ejemplarfosil: 'String',
        proyecto: 'String',
        fuente: 'String',
        formadecitar: 'String',
        licenciauso: 'String',
        urlproyecto: 'String',
        urlorigen: 'String',
        urlejemplar: 'String',
        ultimafechaactualizacion: 'String',
        cuarentena: 'String',
        version: 'String',
        especie: 'String',
        especievalida: 'String',
        especievalidabusqueda: 'String'
    },
    associations: {
        Taxon: {
            type: 'generic_to_one',
            target: 'Taxon'
        },
        caracteristicas_cuantitativas: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'caracteristica_cuantitativa',
            targetKey: 'registro_id',
            keyIn: 'caracteristica_cuantitativa',
            label: 'nombre',
            sublabel: 'valor'
        },
        caracteristicas_cualitativas: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'caracteristica_cualitativa',
            targetKey: 'registro_id',
            keyIn: 'caracteristica_cualitativa',
            label: 'nombre',
            sublabel: 'valor'
        }
    },
    internalId: 'id',
    id: {
        name: 'id',
        type: 'String'
    }
};

module.exports = class Ejemplar {

    /**
     * constructor - Creates an instance of the generic model Ejemplar.
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */
    constructor({
        id,
        region,
        localidad,
        longitud,
        latitud,
        datum,
        validacionambiente,
        geovalidacion,
        paismapa,
        estadomapa,
        claveestadomapa,
        mt24nombreestadomapa,
        mt24claveestadomapa,
        municipiomapa,
        clavemunicipiomapa,
        mt24nombremunicipiomapa,
        mt24clavemunicipiomapa,
        incertidumbrexy,
        altitudmapa,
        usvserieI,
        usvserieII,
        usvserieIII,
        usvserieIV,
        usvserieV,
        usvserieVI,
        anp,
        grupobio,
        subgrupobio,
        taxon,
        autor,
        estatustax,
        reftax,
        taxonvalido,
        autorvalido,
        reftaxvalido,
        taxonvalidado,
        endemismo,
        taxonextinto,
        ambiente,
        nombrecomun,
        formadecrecimiento,
        prioritaria,
        nivelprioridad,
        exoticainvasora,
        nom059,
        cites,
        iucn,
        categoriaresidenciaaves,
        probablelocnodecampo,
        obsusoinfo,
        coleccion,
        institucion,
        paiscoleccion,
        numcatalogo,
        numcolecta,
        procedenciaejemplar,
        determinador,
        aniodeterminacion,
        mesdeterminacion,
        diadeterminacion,
        fechadeterminacion,
        calificadordeterminacion,
        colector,
        aniocolecta,
        mescolecta,
        diacolecta,
        fechacolecta,
        tipo,
        ejemplarfosil,
        proyecto,
        fuente,
        formadecitar,
        licenciauso,
        urlproyecto,
        urlorigen,
        urlejemplar,
        ultimafechaactualizacion,
        cuarentena,
        version,
        especie,
        especievalida,
        especievalidabusqueda
    }) {
        this.id = id;
        this.region = region;
        this.localidad = localidad;
        this.longitud = longitud;
        this.latitud = latitud;
        this.datum = datum;
        this.validacionambiente = validacionambiente;
        this.geovalidacion = geovalidacion;
        this.paismapa = paismapa;
        this.estadomapa = estadomapa;
        this.claveestadomapa = claveestadomapa;
        this.mt24nombreestadomapa = mt24nombreestadomapa;
        this.mt24claveestadomapa = mt24claveestadomapa;
        this.municipiomapa = municipiomapa;
        this.clavemunicipiomapa = clavemunicipiomapa;
        this.mt24nombremunicipiomapa = mt24nombremunicipiomapa;
        this.mt24clavemunicipiomapa = mt24clavemunicipiomapa;
        this.incertidumbrexy = incertidumbrexy;
        this.altitudmapa = altitudmapa;
        this.usvserieI = usvserieI;
        this.usvserieII = usvserieII;
        this.usvserieIII = usvserieIII;
        this.usvserieIV = usvserieIV;
        this.usvserieV = usvserieV;
        this.usvserieVI = usvserieVI;
        this.anp = anp;
        this.grupobio = grupobio;
        this.subgrupobio = subgrupobio;
        this.taxon = taxon;
        this.autor = autor;
        this.estatustax = estatustax;
        this.reftax = reftax;
        this.taxonvalido = taxonvalido;
        this.autorvalido = autorvalido;
        this.reftaxvalido = reftaxvalido;
        this.taxonvalidado = taxonvalidado;
        this.endemismo = endemismo;
        this.taxonextinto = taxonextinto;
        this.ambiente = ambiente;
        this.nombrecomun = nombrecomun;
        this.formadecrecimiento = formadecrecimiento;
        this.prioritaria = prioritaria;
        this.nivelprioridad = nivelprioridad;
        this.exoticainvasora = exoticainvasora;
        this.nom059 = nom059;
        this.cites = cites;
        this.iucn = iucn;
        this.categoriaresidenciaaves = categoriaresidenciaaves;
        this.probablelocnodecampo = probablelocnodecampo;
        this.obsusoinfo = obsusoinfo;
        this.coleccion = coleccion;
        this.institucion = institucion;
        this.paiscoleccion = paiscoleccion;
        this.numcatalogo = numcatalogo;
        this.numcolecta = numcolecta;
        this.procedenciaejemplar = procedenciaejemplar;
        this.determinador = determinador;
        this.aniodeterminacion = aniodeterminacion;
        this.mesdeterminacion = mesdeterminacion;
        this.diadeterminacion = diadeterminacion;
        this.fechadeterminacion = fechadeterminacion;
        this.calificadordeterminacion = calificadordeterminacion;
        this.colector = colector;
        this.aniocolecta = aniocolecta;
        this.mescolecta = mescolecta;
        this.diacolecta = diacolecta;
        this.fechacolecta = fechacolecta;
        this.tipo = tipo;
        this.ejemplarfosil = ejemplarfosil;
        this.proyecto = proyecto;
        this.fuente = fuente;
        this.formadecitar = formadecitar;
        this.licenciauso = licenciauso;
        this.urlproyecto = urlproyecto;
        this.urlorigen = urlorigen;
        this.urlejemplar = urlejemplar;
        this.ultimafechaactualizacion = ultimafechaactualizacion;
        this.cuarentena = cuarentena;
        this.version = version;
        this.especie = especie;
        this.especievalida = especievalida;
        this.especievalidabusqueda = especievalidabusqueda;
    }

    static get name() {
        return "ejemplar";
    }

    static get definition() {
        return definition;
    }

    /**
     * readById - Search for the Ejemplar record whose id is equal to the @id received as parameter.
     * Returns an instance of this class (Ejemplar), with all its properties
     * set from the values of the record fetched.
     * 
     * Returned value:
     *    new Ejemplar(record)
     * 
     * Thrown on:
     *    * No record found.
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from the record fetched.
     * @see: constructor() of the class Ejemplar;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {Ejemplar} Instance of Ejemplar class.
     */
    static async readById(id, benignErrorReporter) {

        /*
        YOUR CODE GOES HERE
         */
        throw new Error('readById() is not implemented for model Ejemplar');
    }

    /**
     * countRecords - Count the number of records of model Ejemplar that match the filters provided
     * in the @search parameter. Returns the number of records counted.
     * @see: Zendro specifications for search object.
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * @param  {object} search Object with search filters.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {int} Number of records counted, that match the search filters.
     */
    static async countRecords(search, benignErrorReporter) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('countRecords() is not implemented for model Ejemplar');
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * limit/offset pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (Ejemplar), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    for each record
     *    array.push( new Ejemplar(record) )
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class Ejemplar;
     * @see: Zendro specifications for limit-offset pagination.
     * @see: Zendro specifications for search and order objects.
     * 
     * @param  {object} search     Object with search filters.
     * @param  {object} order      Object with order specifications.
     * @param  {object} pagination Object with limit/offset pagination properties.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {[Ejemplar]}    Array of instances of Ejemplar class.
     */
    static async readAll(search, order, pagination, benignErrorReporter) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('readAll() is not implemented for model Ejemplar');
    }

    /**
     * readAllCursor - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * cursor based pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (Ejemplar), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    { edges, pageInfo }
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class Ejemplar;
     * @see: Zendro specificatons for cursor based pagination.
     * @see: Zendro specifications for search and order objects.
     * 
     * @param  {object} search     Object with search filters.
     * @param  {object} order      Object with order specifications.
     * @param  {object} pagination Object with pagination properties.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return { edges, pageInfo } Object with edges and pageInfo.
     */
    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        let options = helper.buildCursorBasedGenericOptions(search, order, pagination, this.idAttribute());
        let records = await Ejemplar.readAll(options['search'], options['order'], options['pagination'], benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchGeneric(search, order, pagination, this.idAttribute());
            oppRecords = await Ejemplar.readAll(oppOptions['search'], oppOptions['order'], oppOptions['pagination'], benignErrorReporter);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo
        };
    }

    /**
     * addOne - Creates a new record of model Ejemplar with the values provided
     * on @input object.
     * Only if record was created successfully, returns an instance of this class 
     * (Ejemplar), with all its properties set from the new record created.
     * If this function fails to create the new record, should throw an error.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are set to 
     *       null at creation time.
     *    2. non-existent: attributes not listed on the input are set to null at 
     *       creation time.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new Ejemplar(newRecord)
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where newRecord is an object with all its properties set from the new record created.
     * @see: constructor() of the class Ejemplar;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {Ejemplar} If successfully created, returns an instance of 
     * Ejemplar class constructed with the new record, otherwise throws an error.
     */
    static async addOne(input, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('addOne() is not implemented for model Ejemplar');
    }

    /**
     * updateOne - Updates the Ejemplar record whose id is equal to the value
     * of id attribute: 'id', which should be on received as input.
     * Only if record was updated successfully, returns an instance of this class 
     * (Ejemplar), with all its properties set from the record updated.
     * If this function fails to update the record, should throw an error.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are NOT
     *       updated.
     *    2. non-existent: attributes not listed on the input are NOT updated.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new Ejemplar(updatedRecord)
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where updatedRecord is an object with all its properties set from the record updated.
     * @see: constructor() of the class Ejemplar;
     * 
     * @param  {object} input Input with properties to be updated. The special id 
     * attribute: 'id' should contains the id value of the record
     * that will be updated.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {Ejemplar} If successfully created, returns an instance of 
     * Ejemplar class constructed with the new record, otherwise throws an error.
     */
    static async updateOne(input, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('updateOne() is not implemented for model Ejemplar');
    }

    /**
     * deleteOne - Delete the record whose id is equal to the @id received as parameter.
     * Only if record was deleted successfully, returns the id of the deleted record.
     * If this function fails to delete the record, should throw an error.
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * @param  {String} id The id of the record that will be deleted.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {int} id of the record deleted or throws an error if the operation failed.
     */
    static async deleteOne(id, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('deleteOne is not implemented for model Ejemplar');
    }

    /**
     * bulkAddCsv - Allows the user to bulk-upload a set of records in CSV format.
     *
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     */
    static async bulkAddCsv(context, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('bulkAddCsv() is not implemented for model Ejemplar');
    }

    /**
     * csvTableTemplate - Allows the user to download a template in CSV format with the
     * properties and types of this model.
     *
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     */
    static async csvTableTemplate(benignErrorReporter) {
        return helper.csvTableTemplate(definition);
    }


    /**
     * TaxonImpl - Return associated record.
     *
     * @param  {object} search      Search argument to match the associated record.
     * @param  {object} context     Provided to every resolver holds contextual information like the
     * resquest query and user info.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {type}   Associated record.
     */
    async TaxonImpl({
        search
    }, context, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('TaxonImpl() is not implemented');
    }



    /**
     * add_taxonImpl - field Mutation (model-layer) for add new Taxon association (generic_to_one). 
     *
     * @param {Object}  ejemplar_input Object with all the current attributes of the Ejemplar model record to be updated,
     *                  including info of input ids to add as association.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     */
    static async add_taxonImpl(ejemplar_input, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('add_taxonImpl() is not implemented for model Ejemplar');
    }


    /**
     * remove_taxonImpl - field Mutation (model-layer) for remove new Taxon association (generic_to_one). 
     *
     * @param {Object}  ejemplar_input Object with all the current attributes of the Ejemplar model record to be updated,
     *                  including info of input ids to remove as association.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     */
    static async remove_taxonImpl(ejemplar_input, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('remove_taxonImpl() is not implemented for model Ejemplar');
    }





    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return Ejemplar.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Ejemplar.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Ejemplar.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Ejemplar.idAttribute()]
    }

    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(Ejemplar.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    static externalIdsObject() {
        return {};
    }

};