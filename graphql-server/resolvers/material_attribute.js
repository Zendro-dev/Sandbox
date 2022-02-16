/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const material_attribute = require(path.join(__dirname, '..', 'models', 'index.js')).material_attribute;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');
const validatorUtil = require("../utils/validatorUtil");
const associationArgsDef = {
    'addCharacteristicType': 'ontology_annotation',
    'addAssay_characteristicCategories': 'assay',
    'addStudy_characteristicCategories': 'study',
    'addMaterial_attribute_value_category': 'material_attribute_value'
}



/**
 * material_attribute.prototype.characteristicType - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
material_attribute.prototype.characteristicType = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.characteristicType_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneOntology_annotation({
                [models.ontology_annotation.idAttribute()]: this.characteristicType_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.ontology_annotation.idAttribute(),
                "value": this.characteristicType_fk,
                "operator": "eq"
            });
            let found = (await resolvers.ontology_annotationsConnection({
                search: nsearch,
                pagination: {
                    first: 1
                }
            }, context)).edges;
            if (found.length > 0) {
                return found[0].node
            }
            return found;
        }
    }
}

/**
 * material_attribute.prototype.assay_characteristicCategoriesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material_attribute.prototype.assay_characteristicCategoriesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_characteristicCategories_fk) || this.assay_characteristicCategories_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.assay.idAttribute(),
        "value": this.assay_characteristicCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.assays({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * material_attribute.prototype.countFilteredAssay_characteristicCategories - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material_attribute.prototype.countFilteredAssay_characteristicCategories = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_characteristicCategories_fk) || this.assay_characteristicCategories_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.assay.idAttribute(),
        "value": this.assay_characteristicCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countAssays({
        search: nsearch
    }, context);
}

/**
 * material_attribute.prototype.assay_characteristicCategoriesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material_attribute.prototype.assay_characteristicCategoriesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_characteristicCategories_fk) || this.assay_characteristicCategories_fk.length === 0) {
        return {
            edges: [],
            assays: [],
            pageInfo: {
                startCursor: null,
                endCursor: null,
                hasPreviousPage: false,
                hasNextPage: false
            }
        };
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.assay.idAttribute(),
        "value": this.assay_characteristicCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.assaysConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * material_attribute.prototype.study_characteristicCategoriesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material_attribute.prototype.study_characteristicCategoriesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_characteristicCategories_fk) || this.study_characteristicCategories_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_characteristicCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.studies({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * material_attribute.prototype.countFilteredStudy_characteristicCategories - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material_attribute.prototype.countFilteredStudy_characteristicCategories = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_characteristicCategories_fk) || this.study_characteristicCategories_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_characteristicCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countStudies({
        search: nsearch
    }, context);
}

/**
 * material_attribute.prototype.study_characteristicCategoriesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material_attribute.prototype.study_characteristicCategoriesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_characteristicCategories_fk) || this.study_characteristicCategories_fk.length === 0) {
        return {
            edges: [],
            studies: [],
            pageInfo: {
                startCursor: null,
                endCursor: null,
                hasPreviousPage: false,
                hasNextPage: false
            }
        };
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_characteristicCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.studiesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * material_attribute.prototype.material_attribute_value_categoryFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material_attribute.prototype.material_attribute_value_categoryFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "category_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.material_attribute_values({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * material_attribute.prototype.countFilteredMaterial_attribute_value_category - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material_attribute.prototype.countFilteredMaterial_attribute_value_category = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "category_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countMaterial_attribute_values({
        search: nsearch
    }, context);
}

/**
 * material_attribute.prototype.material_attribute_value_categoryConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material_attribute.prototype.material_attribute_value_categoryConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "category_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.material_attribute_valuesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addAssay_characteristicCategories)) {
        promises_add.push(this.add_assay_characteristicCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addStudy_characteristicCategories)) {
        promises_add.push(this.add_study_characteristicCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMaterial_attribute_value_category)) {
        promises_add.push(this.add_material_attribute_value_category(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addCharacteristicType)) {
        promises_add.push(this.add_characteristicType(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeAssay_characteristicCategories)) {
        promises_remove.push(this.remove_assay_characteristicCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeStudy_characteristicCategories)) {
        promises_remove.push(this.remove_study_characteristicCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMaterial_attribute_value_category)) {
        promises_remove.push(this.remove_material_attribute_value_category(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeCharacteristicType)) {
        promises_remove.push(this.remove_characteristicType(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_assay_characteristicCategories - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute.prototype.add_assay_characteristicCategories = async function(input, benignErrorReporter) {

    await material_attribute.add_assay_characteristicCategories_fk(this.getIdValue(), input.addAssay_characteristicCategories, benignErrorReporter);
    this.assay_characteristicCategories_fk = helper.unionIds(this.assay_characteristicCategories_fk, input.addAssay_characteristicCategories);
}

/**
 * add_study_characteristicCategories - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute.prototype.add_study_characteristicCategories = async function(input, benignErrorReporter) {

    await material_attribute.add_study_characteristicCategories_fk(this.getIdValue(), input.addStudy_characteristicCategories, benignErrorReporter);
    this.study_characteristicCategories_fk = helper.unionIds(this.study_characteristicCategories_fk, input.addStudy_characteristicCategories);
}

/**
 * add_material_attribute_value_category - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute.prototype.add_material_attribute_value_category = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addMaterial_attribute_value_category.map(associatedRecordId => {
        return {
            category_fk: this.getIdValue(),
            [models.material_attribute_value.idAttribute()]: associatedRecordId
        }
    });
    await models.material_attribute_value.bulkAssociateMaterial_attribute_valueWithCategory_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_characteristicType - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute.prototype.add_characteristicType = async function(input, benignErrorReporter) {
    await material_attribute.add_characteristicType_fk(this.getIdValue(), input.addCharacteristicType, benignErrorReporter);
    this.characteristicType_fk = input.addCharacteristicType;
}

/**
 * remove_assay_characteristicCategories - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute.prototype.remove_assay_characteristicCategories = async function(input, benignErrorReporter) {

    await material_attribute.remove_assay_characteristicCategories_fk(this.getIdValue(), input.removeAssay_characteristicCategories, benignErrorReporter);
    this.assay_characteristicCategories_fk = helper.differenceIds(this.assay_characteristicCategories_fk, input.removeAssay_characteristicCategories);
}

/**
 * remove_study_characteristicCategories - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute.prototype.remove_study_characteristicCategories = async function(input, benignErrorReporter) {

    await material_attribute.remove_study_characteristicCategories_fk(this.getIdValue(), input.removeStudy_characteristicCategories, benignErrorReporter);
    this.study_characteristicCategories_fk = helper.differenceIds(this.study_characteristicCategories_fk, input.removeStudy_characteristicCategories);
}

/**
 * remove_material_attribute_value_category - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute.prototype.remove_material_attribute_value_category = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeMaterial_attribute_value_category.map(associatedRecordId => {
        return {
            category_fk: this.getIdValue(),
            [models.material_attribute_value.idAttribute()]: associatedRecordId
        }
    });
    await models.material_attribute_value.bulkDisAssociateMaterial_attribute_valueWithCategory_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_characteristicType - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute.prototype.remove_characteristicType = async function(input, benignErrorReporter) {
    if (input.removeCharacteristicType == this.characteristicType_fk) {
        await material_attribute.remove_characteristicType_fk(this.getIdValue(), input.removeCharacteristicType, benignErrorReporter);
        this.characteristicType_fk = null;
    }
}



/**
 * countAssociatedRecordsWithRejectReaction - Count associated records with reject deletion action
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAssociatedRecordsWithRejectReaction(id, context) {

    let material_attribute = await resolvers.readOneMaterial_attribute({
        id: id
    }, context);
    //check that record actually exists
    if (material_attribute === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;

    get_to_many_associated_fk += Array.isArray(material_attribute.assay_characteristicCategories_fk) ? material_attribute.assay_characteristicCategories_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(material_attribute.study_characteristicCategories_fk) ? material_attribute.study_characteristicCategories_fk.length : 0;
    promises_to_many.push(material_attribute.countFilteredMaterial_attribute_value_category({}, context));
    promises_to_one.push(material_attribute.characteristicType({}, context));


    let result_to_many = await Promise.all(promises_to_many);
    let result_to_one = await Promise.all(promises_to_one);

    let get_to_many_associated = result_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);
    let get_to_one_associated = result_to_one.filter((r, index) => helper.isNotUndefinedAndNotNull(r)).length;

    return get_to_one_associated + get_to_many_associated_fk + get_to_many_associated;
}

/**
 * validForDeletion - Checks wether a record is allowed to be deleted
 *
 * @param  {ID} id      Id of record to check if it can be deleted
 * @param  {object} context Default context by resolver
 * @return {boolean}         True if it is allowed to be deleted and false otherwise
 */
async function validForDeletion(id, context) {
    if (await countAssociatedRecordsWithRejectReaction(id, context) > 0) {
        throw new Error(`material_attribute with id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

/**
 * updateAssociations - update associations for a given record
 *
 * @param  {ID} id      Id of record
 * @param  {object} context Default context by resolver
 */
const updateAssociations = async (id, context) => {
    const material_attribute_record = await resolvers.readOneMaterial_attribute({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * material_attributes - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    material_attributes: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'material_attribute', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "material_attributes");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material_attribute.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * material_attributesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    material_attributesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'material_attribute', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "material_attributesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material_attribute.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneMaterial_attribute - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneMaterial_attribute: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'material_attribute', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneMaterial_attribute");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material_attribute.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countMaterial_attributes - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countMaterial_attributes: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'material_attribute', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material_attribute.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateMaterial_attributeForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterial_attributeForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'material_attribute', 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);

            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            try {
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(
                        inputSanitized,
                        context,
                        associationArgsDef
                    );
                }
                await validatorUtil.validateData(
                    "validateForCreate",
                    material_attribute,
                    inputSanitized
                );
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateMaterial_attributeForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterial_attributeForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'material_attribute', 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);

            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            try {
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(
                        inputSanitized,
                        context,
                        associationArgsDef
                    );
                }
                await validatorUtil.validateData(
                    "validateForUpdate",
                    material_attribute,
                    inputSanitized
                );
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateMaterial_attributeForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterial_attributeForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'material_attribute', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    material_attribute,
                    id);
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateMaterial_attributeAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterial_attributeAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'material_attribute', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    material_attribute,
                    id);
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },
    /**
     * addMaterial_attribute - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addMaterial_attribute: async function(input, context) {
        let authorization = await checkAuthorization(context, 'material_attribute', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdMaterial_attribute = await material_attribute.addOne(inputSanitized, benignErrorReporter);
            await createdMaterial_attribute.handleAssociations(inputSanitized, benignErrorReporter);
            return createdMaterial_attribute;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddMaterial_attributeCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddMaterial_attributeCsv: async function(_, context) {
        if (await checkAuthorization(context, 'material_attribute', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return material_attribute.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteMaterial_attribute - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteMaterial_attribute: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'material_attribute', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return material_attribute.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateMaterial_attribute - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateMaterial_attribute: async function(input, context) {
        let authorization = await checkAuthorization(context, 'material_attribute', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedMaterial_attribute = await material_attribute.updateOne(inputSanitized, benignErrorReporter);
            await updatedMaterial_attribute.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedMaterial_attribute;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateMaterial_attributeWithCharacteristicType_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateMaterial_attributeWithCharacteristicType_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                characteristicType_fk
            }) => characteristicType_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), material_attribute);
        }
        return await material_attribute.bulkAssociateMaterial_attributeWithCharacteristicType_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateMaterial_attributeWithCharacteristicType_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateMaterial_attributeWithCharacteristicType_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                characteristicType_fk
            }) => characteristicType_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), material_attribute);
        }
        return await material_attribute.bulkDisAssociateMaterial_attributeWithCharacteristicType_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateMaterial_attribute - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateMaterial_attribute: async function(_, context) {
        if (await checkAuthorization(context, 'material_attribute', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return material_attribute.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}