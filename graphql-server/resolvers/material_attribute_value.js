/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const material_attribute_value = require(path.join(__dirname, '..', 'models', 'index.js')).material_attribute_value;
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
    'addCategory': 'material_attribute',
    'addUnit': 'ontology_annotation',
    'addComments': 'comment',
    'addMaterial_characteristics': 'material',
    'addSource_characteristics': 'source',
    'addSample_characteristics': 'sample'
}



/**
 * material_attribute_value.prototype.category - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
material_attribute_value.prototype.category = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.category_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneMaterial_attribute({
                [models.material_attribute.idAttribute()]: this.category_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.material_attribute.idAttribute(),
                "value": this.category_fk,
                "operator": "eq"
            });
            let found = (await resolvers.material_attributesConnection({
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
 * material_attribute_value.prototype.unit - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
material_attribute_value.prototype.unit = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.unit_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneOntology_annotation({
                [models.ontology_annotation.idAttribute()]: this.unit_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.ontology_annotation.idAttribute(),
                "value": this.unit_fk,
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
 * material_attribute_value.prototype.commentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material_attribute_value.prototype.commentsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "material_attribute_value_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.comments({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * material_attribute_value.prototype.countFilteredComments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material_attribute_value.prototype.countFilteredComments = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "material_attribute_value_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countComments({
        search: nsearch
    }, context);
}

/**
 * material_attribute_value.prototype.commentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material_attribute_value.prototype.commentsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "material_attribute_value_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.commentsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * material_attribute_value.prototype.material_characteristicsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material_attribute_value.prototype.material_characteristicsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.material_characteristics_fk) || this.material_characteristics_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.material_characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.materials({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * material_attribute_value.prototype.countFilteredMaterial_characteristics - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material_attribute_value.prototype.countFilteredMaterial_characteristics = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.material_characteristics_fk) || this.material_characteristics_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.material_characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countMaterials({
        search: nsearch
    }, context);
}

/**
 * material_attribute_value.prototype.material_characteristicsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material_attribute_value.prototype.material_characteristicsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.material_characteristics_fk) || this.material_characteristics_fk.length === 0) {
        return {
            edges: [],
            materials: [],
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
        "field": models.material.idAttribute(),
        "value": this.material_characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.materialsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * material_attribute_value.prototype.source_characteristicsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material_attribute_value.prototype.source_characteristicsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.source_characteristics_fk) || this.source_characteristics_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.source.idAttribute(),
        "value": this.source_characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.sources({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * material_attribute_value.prototype.countFilteredSource_characteristics - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material_attribute_value.prototype.countFilteredSource_characteristics = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.source_characteristics_fk) || this.source_characteristics_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.source.idAttribute(),
        "value": this.source_characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countSources({
        search: nsearch
    }, context);
}

/**
 * material_attribute_value.prototype.source_characteristicsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material_attribute_value.prototype.source_characteristicsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.source_characteristics_fk) || this.source_characteristics_fk.length === 0) {
        return {
            edges: [],
            sources: [],
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
        "field": models.source.idAttribute(),
        "value": this.source_characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.sourcesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * material_attribute_value.prototype.sample_characteristicsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material_attribute_value.prototype.sample_characteristicsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.sample_characteristics_fk) || this.sample_characteristics_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.sample.idAttribute(),
        "value": this.sample_characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.samples({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * material_attribute_value.prototype.countFilteredSample_characteristics - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material_attribute_value.prototype.countFilteredSample_characteristics = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.sample_characteristics_fk) || this.sample_characteristics_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.sample.idAttribute(),
        "value": this.sample_characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countSamples({
        search: nsearch
    }, context);
}

/**
 * material_attribute_value.prototype.sample_characteristicsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material_attribute_value.prototype.sample_characteristicsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.sample_characteristics_fk) || this.sample_characteristics_fk.length === 0) {
        return {
            edges: [],
            samples: [],
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
        "field": models.sample.idAttribute(),
        "value": this.sample_characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.samplesConnection({
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
material_attribute_value.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addComments)) {
        promises_add.push(this.add_comments(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMaterial_characteristics)) {
        promises_add.push(this.add_material_characteristics(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addSource_characteristics)) {
        promises_add.push(this.add_source_characteristics(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addSample_characteristics)) {
        promises_add.push(this.add_sample_characteristics(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addCategory)) {
        promises_add.push(this.add_category(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addUnit)) {
        promises_add.push(this.add_unit(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeComments)) {
        promises_remove.push(this.remove_comments(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMaterial_characteristics)) {
        promises_remove.push(this.remove_material_characteristics(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeSource_characteristics)) {
        promises_remove.push(this.remove_source_characteristics(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeSample_characteristics)) {
        promises_remove.push(this.remove_sample_characteristics(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeCategory)) {
        promises_remove.push(this.remove_category(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeUnit)) {
        promises_remove.push(this.remove_unit(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_comments - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.add_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addComments.map(associatedRecordId => {
        return {
            material_attribute_value_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkAssociateCommentWithMaterial_attribute_value_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_material_characteristics - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.add_material_characteristics = async function(input, benignErrorReporter) {

    await material_attribute_value.add_material_characteristics_fk(this.getIdValue(), input.addMaterial_characteristics, benignErrorReporter);
    this.material_characteristics_fk = helper.unionIds(this.material_characteristics_fk, input.addMaterial_characteristics);
}

/**
 * add_source_characteristics - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.add_source_characteristics = async function(input, benignErrorReporter) {

    await material_attribute_value.add_source_characteristics_fk(this.getIdValue(), input.addSource_characteristics, benignErrorReporter);
    this.source_characteristics_fk = helper.unionIds(this.source_characteristics_fk, input.addSource_characteristics);
}

/**
 * add_sample_characteristics - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.add_sample_characteristics = async function(input, benignErrorReporter) {

    await material_attribute_value.add_sample_characteristics_fk(this.getIdValue(), input.addSample_characteristics, benignErrorReporter);
    this.sample_characteristics_fk = helper.unionIds(this.sample_characteristics_fk, input.addSample_characteristics);
}

/**
 * add_category - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.add_category = async function(input, benignErrorReporter) {
    await material_attribute_value.add_category_fk(this.getIdValue(), input.addCategory, benignErrorReporter);
    this.category_fk = input.addCategory;
}

/**
 * add_unit - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.add_unit = async function(input, benignErrorReporter) {
    await material_attribute_value.add_unit_fk(this.getIdValue(), input.addUnit, benignErrorReporter);
    this.unit_fk = input.addUnit;
}

/**
 * remove_comments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.remove_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeComments.map(associatedRecordId => {
        return {
            material_attribute_value_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkDisAssociateCommentWithMaterial_attribute_value_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_material_characteristics - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.remove_material_characteristics = async function(input, benignErrorReporter) {

    await material_attribute_value.remove_material_characteristics_fk(this.getIdValue(), input.removeMaterial_characteristics, benignErrorReporter);
    this.material_characteristics_fk = helper.differenceIds(this.material_characteristics_fk, input.removeMaterial_characteristics);
}

/**
 * remove_source_characteristics - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.remove_source_characteristics = async function(input, benignErrorReporter) {

    await material_attribute_value.remove_source_characteristics_fk(this.getIdValue(), input.removeSource_characteristics, benignErrorReporter);
    this.source_characteristics_fk = helper.differenceIds(this.source_characteristics_fk, input.removeSource_characteristics);
}

/**
 * remove_sample_characteristics - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.remove_sample_characteristics = async function(input, benignErrorReporter) {

    await material_attribute_value.remove_sample_characteristics_fk(this.getIdValue(), input.removeSample_characteristics, benignErrorReporter);
    this.sample_characteristics_fk = helper.differenceIds(this.sample_characteristics_fk, input.removeSample_characteristics);
}

/**
 * remove_category - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.remove_category = async function(input, benignErrorReporter) {
    if (input.removeCategory == this.category_fk) {
        await material_attribute_value.remove_category_fk(this.getIdValue(), input.removeCategory, benignErrorReporter);
        this.category_fk = null;
    }
}

/**
 * remove_unit - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material_attribute_value.prototype.remove_unit = async function(input, benignErrorReporter) {
    if (input.removeUnit == this.unit_fk) {
        await material_attribute_value.remove_unit_fk(this.getIdValue(), input.removeUnit, benignErrorReporter);
        this.unit_fk = null;
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

    let material_attribute_value = await resolvers.readOneMaterial_attribute_value({
        id: id
    }, context);
    //check that record actually exists
    if (material_attribute_value === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    promises_to_many.push(material_attribute_value.countFilteredComments({}, context));

    get_to_many_associated_fk += Array.isArray(material_attribute_value.material_characteristics_fk) ? material_attribute_value.material_characteristics_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(material_attribute_value.source_characteristics_fk) ? material_attribute_value.source_characteristics_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(material_attribute_value.sample_characteristics_fk) ? material_attribute_value.sample_characteristics_fk.length : 0;
    promises_to_one.push(material_attribute_value.category({}, context));
    promises_to_one.push(material_attribute_value.unit({}, context));


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
        throw new Error(`material_attribute_value with id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
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
    const material_attribute_value_record = await resolvers.readOneMaterial_attribute_value({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * material_attribute_values - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    material_attribute_values: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'material_attribute_value', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "material_attribute_values");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material_attribute_value.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * material_attribute_valuesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    material_attribute_valuesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'material_attribute_value', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "material_attribute_valuesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material_attribute_value.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneMaterial_attribute_value - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneMaterial_attribute_value: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'material_attribute_value', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneMaterial_attribute_value");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material_attribute_value.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countMaterial_attribute_values - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countMaterial_attribute_values: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'material_attribute_value', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material_attribute_value.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateMaterial_attribute_valueForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterial_attribute_valueForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'material_attribute_value', 'read');
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
                    material_attribute_value,
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
     * validateMaterial_attribute_valueForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterial_attribute_valueForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'material_attribute_value', 'read');
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
                    material_attribute_value,
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
     * validateMaterial_attribute_valueForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterial_attribute_valueForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'material_attribute_value', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    material_attribute_value,
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
     * validateMaterial_attribute_valueAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterial_attribute_valueAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'material_attribute_value', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    material_attribute_value,
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
     * addMaterial_attribute_value - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addMaterial_attribute_value: async function(input, context) {
        let authorization = await checkAuthorization(context, 'material_attribute_value', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdMaterial_attribute_value = await material_attribute_value.addOne(inputSanitized, benignErrorReporter);
            await createdMaterial_attribute_value.handleAssociations(inputSanitized, benignErrorReporter);
            return createdMaterial_attribute_value;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddMaterial_attribute_valueCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddMaterial_attribute_valueCsv: async function(_, context) {
        if (await checkAuthorization(context, 'material_attribute_value', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return material_attribute_value.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteMaterial_attribute_value - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteMaterial_attribute_value: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'material_attribute_value', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return material_attribute_value.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateMaterial_attribute_value - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateMaterial_attribute_value: async function(input, context) {
        let authorization = await checkAuthorization(context, 'material_attribute_value', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedMaterial_attribute_value = await material_attribute_value.updateOne(inputSanitized, benignErrorReporter);
            await updatedMaterial_attribute_value.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedMaterial_attribute_value;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateMaterial_attribute_valueWithCategory_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateMaterial_attribute_valueWithCategory_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                category_fk
            }) => category_fk)), models.material_attribute);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), material_attribute_value);
        }
        return await material_attribute_value.bulkAssociateMaterial_attribute_valueWithCategory_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateMaterial_attribute_valueWithUnit_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateMaterial_attribute_valueWithUnit_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                unit_fk
            }) => unit_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), material_attribute_value);
        }
        return await material_attribute_value.bulkAssociateMaterial_attribute_valueWithUnit_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateMaterial_attribute_valueWithCategory_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateMaterial_attribute_valueWithCategory_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                category_fk
            }) => category_fk)), models.material_attribute);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), material_attribute_value);
        }
        return await material_attribute_value.bulkDisAssociateMaterial_attribute_valueWithCategory_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateMaterial_attribute_valueWithUnit_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateMaterial_attribute_valueWithUnit_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                unit_fk
            }) => unit_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), material_attribute_value);
        }
        return await material_attribute_value.bulkDisAssociateMaterial_attribute_valueWithUnit_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateMaterial_attribute_value - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateMaterial_attribute_value: async function(_, context) {
        if (await checkAuthorization(context, 'material_attribute_value', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return material_attribute_value.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}