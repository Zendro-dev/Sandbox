/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const ontology_annotation = require(path.join(__dirname, '..', 'models', 'index.js')).ontology_annotation;
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
    'addComments': 'comment',
    'addAssay_measurementType': 'assay',
    'addAssay_unitCategories': 'assay',
    'addPublication_status': 'publication',
    'addPerson_roles': 'person',
    'addStudy_studyDesignDescriptors': 'study',
    'addFactor_factorType': 'factor',
    'addStudy_unitCategories': 'study',
    'addProtocol_protocolType': 'protocol',
    'addProtocol_parameter_parameterName': 'protocol_parameter',
    'addMaterial_attribute_characteristicType': 'material_attribute',
    'addMaterial_attribute_value_unit': 'material_attribute_value',
    'addFactor_value_unit': 'factor_value',
    'addProcess_parameter_value_unit': 'process_parameter_value',
    'addAssay_technologyType': 'assay',
    'addComponent_componentType': 'component'
}




/**
 * ontology_annotation.prototype.commentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.commentsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontology_annotation_comments_fk",
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
 * ontology_annotation.prototype.countFilteredComments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredComments = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontology_annotation_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countComments({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.commentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.commentsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontology_annotation_comments_fk",
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
 * ontology_annotation.prototype.assay_measurementTypeFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.assay_measurementTypeFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "measurementType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.assays({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontology_annotation.prototype.countFilteredAssay_measurementType - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredAssay_measurementType = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "measurementType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countAssays({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.assay_measurementTypeConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.assay_measurementTypeConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "measurementType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.assaysConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontology_annotation.prototype.assay_unitCategoriesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.assay_unitCategoriesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_unitCategories_fk) || this.assay_unitCategories_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.assay.idAttribute(),
        "value": this.assay_unitCategories_fk.join(','),
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
 * ontology_annotation.prototype.countFilteredAssay_unitCategories - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredAssay_unitCategories = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_unitCategories_fk) || this.assay_unitCategories_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.assay.idAttribute(),
        "value": this.assay_unitCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countAssays({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.assay_unitCategoriesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.assay_unitCategoriesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_unitCategories_fk) || this.assay_unitCategories_fk.length === 0) {
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
        "value": this.assay_unitCategories_fk.join(','),
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
 * ontology_annotation.prototype.publication_statusFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.publication_statusFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "status_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.publications({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontology_annotation.prototype.countFilteredPublication_status - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredPublication_status = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "status_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countPublications({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.publication_statusConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.publication_statusConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "status_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.publicationsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontology_annotation.prototype.person_rolesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.person_rolesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.person_roles_fk) || this.person_roles_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.person.idAttribute(),
        "value": this.person_roles_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.people({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontology_annotation.prototype.countFilteredPerson_roles - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredPerson_roles = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.person_roles_fk) || this.person_roles_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.person.idAttribute(),
        "value": this.person_roles_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countPeople({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.person_rolesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.person_rolesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.person_roles_fk) || this.person_roles_fk.length === 0) {
        return {
            edges: [],
            people: [],
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
        "field": models.person.idAttribute(),
        "value": this.person_roles_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.peopleConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontology_annotation.prototype.study_studyDesignDescriptorsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.study_studyDesignDescriptorsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_studyDesignDescriptors_fk) || this.study_studyDesignDescriptors_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_studyDesignDescriptors_fk.join(','),
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
 * ontology_annotation.prototype.countFilteredStudy_studyDesignDescriptors - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredStudy_studyDesignDescriptors = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_studyDesignDescriptors_fk) || this.study_studyDesignDescriptors_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_studyDesignDescriptors_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countStudies({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.study_studyDesignDescriptorsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.study_studyDesignDescriptorsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_studyDesignDescriptors_fk) || this.study_studyDesignDescriptors_fk.length === 0) {
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
        "value": this.study_studyDesignDescriptors_fk.join(','),
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
 * ontology_annotation.prototype.factor_factorTypeFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.factor_factorTypeFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "factorType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.factors({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontology_annotation.prototype.countFilteredFactor_factorType - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredFactor_factorType = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "factorType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countFactors({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.factor_factorTypeConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.factor_factorTypeConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "factorType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.factorsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontology_annotation.prototype.study_unitCategoriesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.study_unitCategoriesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_unitCategories_fk) || this.study_unitCategories_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_unitCategories_fk.join(','),
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
 * ontology_annotation.prototype.countFilteredStudy_unitCategories - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredStudy_unitCategories = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_unitCategories_fk) || this.study_unitCategories_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_unitCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countStudies({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.study_unitCategoriesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.study_unitCategoriesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_unitCategories_fk) || this.study_unitCategories_fk.length === 0) {
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
        "value": this.study_unitCategories_fk.join(','),
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
 * ontology_annotation.prototype.protocol_protocolTypeFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.protocol_protocolTypeFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "protocolType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.protocols({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontology_annotation.prototype.countFilteredProtocol_protocolType - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredProtocol_protocolType = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "protocolType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countProtocols({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.protocol_protocolTypeConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.protocol_protocolTypeConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "protocolType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.protocolsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontology_annotation.prototype.protocol_parameter_parameterNameFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.protocol_parameter_parameterNameFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "parameterName_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.protocol_parameters({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontology_annotation.prototype.countFilteredProtocol_parameter_parameterName - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredProtocol_parameter_parameterName = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "parameterName_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countProtocol_parameters({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.protocol_parameter_parameterNameConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.protocol_parameter_parameterNameConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "parameterName_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.protocol_parametersConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontology_annotation.prototype.material_attribute_characteristicTypeFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.material_attribute_characteristicTypeFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "characteristicType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.material_attributes({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontology_annotation.prototype.countFilteredMaterial_attribute_characteristicType - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredMaterial_attribute_characteristicType = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "characteristicType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countMaterial_attributes({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.material_attribute_characteristicTypeConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.material_attribute_characteristicTypeConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "characteristicType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.material_attributesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontology_annotation.prototype.material_attribute_value_unitFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.material_attribute_value_unitFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "unit_fk",
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
 * ontology_annotation.prototype.countFilteredMaterial_attribute_value_unit - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredMaterial_attribute_value_unit = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "unit_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countMaterial_attribute_values({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.material_attribute_value_unitConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.material_attribute_value_unitConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "unit_fk",
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
 * ontology_annotation.prototype.factor_value_unitFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.factor_value_unitFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "unit_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.factor_values({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontology_annotation.prototype.countFilteredFactor_value_unit - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredFactor_value_unit = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "unit_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countFactor_values({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.factor_value_unitConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.factor_value_unitConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "unit_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.factor_valuesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontology_annotation.prototype.process_parameter_value_unitFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.process_parameter_value_unitFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "unit_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.process_parameter_values({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontology_annotation.prototype.countFilteredProcess_parameter_value_unit - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredProcess_parameter_value_unit = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "unit_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countProcess_parameter_values({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.process_parameter_value_unitConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.process_parameter_value_unitConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "unit_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.process_parameter_valuesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontology_annotation.prototype.assay_technologyTypeFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.assay_technologyTypeFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "technologyType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.assays({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontology_annotation.prototype.countFilteredAssay_technologyType - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredAssay_technologyType = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "technologyType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countAssays({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.assay_technologyTypeConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.assay_technologyTypeConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "technologyType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.assaysConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontology_annotation.prototype.component_componentTypeFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.component_componentTypeFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "componentType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.components({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontology_annotation.prototype.countFilteredComponent_componentType - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontology_annotation.prototype.countFilteredComponent_componentType = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "componentType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countComponents({
        search: nsearch
    }, context);
}

/**
 * ontology_annotation.prototype.component_componentTypeConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontology_annotation.prototype.component_componentTypeConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "componentType_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.componentsConnection({
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
ontology_annotation.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addComments)) {
        promises_add.push(this.add_comments(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addAssay_measurementType)) {
        promises_add.push(this.add_assay_measurementType(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addAssay_unitCategories)) {
        promises_add.push(this.add_assay_unitCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addPublication_status)) {
        promises_add.push(this.add_publication_status(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addPerson_roles)) {
        promises_add.push(this.add_person_roles(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addStudy_studyDesignDescriptors)) {
        promises_add.push(this.add_study_studyDesignDescriptors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addFactor_factorType)) {
        promises_add.push(this.add_factor_factorType(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addStudy_unitCategories)) {
        promises_add.push(this.add_study_unitCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addProtocol_protocolType)) {
        promises_add.push(this.add_protocol_protocolType(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addProtocol_parameter_parameterName)) {
        promises_add.push(this.add_protocol_parameter_parameterName(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMaterial_attribute_characteristicType)) {
        promises_add.push(this.add_material_attribute_characteristicType(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMaterial_attribute_value_unit)) {
        promises_add.push(this.add_material_attribute_value_unit(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addFactor_value_unit)) {
        promises_add.push(this.add_factor_value_unit(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addProcess_parameter_value_unit)) {
        promises_add.push(this.add_process_parameter_value_unit(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addAssay_technologyType)) {
        promises_add.push(this.add_assay_technologyType(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addComponent_componentType)) {
        promises_add.push(this.add_component_componentType(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeComments)) {
        promises_remove.push(this.remove_comments(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeAssay_measurementType)) {
        promises_remove.push(this.remove_assay_measurementType(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeAssay_unitCategories)) {
        promises_remove.push(this.remove_assay_unitCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removePublication_status)) {
        promises_remove.push(this.remove_publication_status(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removePerson_roles)) {
        promises_remove.push(this.remove_person_roles(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeStudy_studyDesignDescriptors)) {
        promises_remove.push(this.remove_study_studyDesignDescriptors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeFactor_factorType)) {
        promises_remove.push(this.remove_factor_factorType(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeStudy_unitCategories)) {
        promises_remove.push(this.remove_study_unitCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeProtocol_protocolType)) {
        promises_remove.push(this.remove_protocol_protocolType(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeProtocol_parameter_parameterName)) {
        promises_remove.push(this.remove_protocol_parameter_parameterName(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMaterial_attribute_characteristicType)) {
        promises_remove.push(this.remove_material_attribute_characteristicType(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMaterial_attribute_value_unit)) {
        promises_remove.push(this.remove_material_attribute_value_unit(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeFactor_value_unit)) {
        promises_remove.push(this.remove_factor_value_unit(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeProcess_parameter_value_unit)) {
        promises_remove.push(this.remove_process_parameter_value_unit(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeAssay_technologyType)) {
        promises_remove.push(this.remove_assay_technologyType(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeComponent_componentType)) {
        promises_remove.push(this.remove_component_componentType(input, benignErrorReporter));
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
ontology_annotation.prototype.add_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addComments.map(associatedRecordId => {
        return {
            ontology_annotation_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkAssociateCommentWithOntology_annotation_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_assay_measurementType - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_assay_measurementType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addAssay_measurementType.map(associatedRecordId => {
        return {
            measurementType_fk: this.getIdValue(),
            [models.assay.idAttribute()]: associatedRecordId
        }
    });
    await models.assay.bulkAssociateAssayWithMeasurementType_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_assay_unitCategories - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_assay_unitCategories = async function(input, benignErrorReporter) {

    await ontology_annotation.add_assay_unitCategories_fk(this.getIdValue(), input.addAssay_unitCategories, benignErrorReporter);
    this.assay_unitCategories_fk = helper.unionIds(this.assay_unitCategories_fk, input.addAssay_unitCategories);
}

/**
 * add_publication_status - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_publication_status = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addPublication_status.map(associatedRecordId => {
        return {
            status_fk: this.getIdValue(),
            [models.publication.idAttribute()]: associatedRecordId
        }
    });
    await models.publication.bulkAssociatePublicationWithStatus_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_person_roles - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_person_roles = async function(input, benignErrorReporter) {

    await ontology_annotation.add_person_roles_fk(this.getIdValue(), input.addPerson_roles, benignErrorReporter);
    this.person_roles_fk = helper.unionIds(this.person_roles_fk, input.addPerson_roles);
}

/**
 * add_study_studyDesignDescriptors - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_study_studyDesignDescriptors = async function(input, benignErrorReporter) {

    await ontology_annotation.add_study_studyDesignDescriptors_fk(this.getIdValue(), input.addStudy_studyDesignDescriptors, benignErrorReporter);
    this.study_studyDesignDescriptors_fk = helper.unionIds(this.study_studyDesignDescriptors_fk, input.addStudy_studyDesignDescriptors);
}

/**
 * add_factor_factorType - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_factor_factorType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addFactor_factorType.map(associatedRecordId => {
        return {
            factorType_fk: this.getIdValue(),
            [models.factor.idAttribute()]: associatedRecordId
        }
    });
    await models.factor.bulkAssociateFactorWithFactorType_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_study_unitCategories - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_study_unitCategories = async function(input, benignErrorReporter) {

    await ontology_annotation.add_study_unitCategories_fk(this.getIdValue(), input.addStudy_unitCategories, benignErrorReporter);
    this.study_unitCategories_fk = helper.unionIds(this.study_unitCategories_fk, input.addStudy_unitCategories);
}

/**
 * add_protocol_protocolType - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_protocol_protocolType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addProtocol_protocolType.map(associatedRecordId => {
        return {
            protocolType_fk: this.getIdValue(),
            [models.protocol.idAttribute()]: associatedRecordId
        }
    });
    await models.protocol.bulkAssociateProtocolWithProtocolType_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_protocol_parameter_parameterName - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_protocol_parameter_parameterName = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addProtocol_parameter_parameterName.map(associatedRecordId => {
        return {
            parameterName_fk: this.getIdValue(),
            [models.protocol_parameter.idAttribute()]: associatedRecordId
        }
    });
    await models.protocol_parameter.bulkAssociateProtocol_parameterWithParameterName_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_material_attribute_characteristicType - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_material_attribute_characteristicType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addMaterial_attribute_characteristicType.map(associatedRecordId => {
        return {
            characteristicType_fk: this.getIdValue(),
            [models.material_attribute.idAttribute()]: associatedRecordId
        }
    });
    await models.material_attribute.bulkAssociateMaterial_attributeWithCharacteristicType_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_material_attribute_value_unit - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_material_attribute_value_unit = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addMaterial_attribute_value_unit.map(associatedRecordId => {
        return {
            unit_fk: this.getIdValue(),
            [models.material_attribute_value.idAttribute()]: associatedRecordId
        }
    });
    await models.material_attribute_value.bulkAssociateMaterial_attribute_valueWithUnit_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_factor_value_unit - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_factor_value_unit = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addFactor_value_unit.map(associatedRecordId => {
        return {
            unit_fk: this.getIdValue(),
            [models.factor_value.idAttribute()]: associatedRecordId
        }
    });
    await models.factor_value.bulkAssociateFactor_valueWithUnit_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_process_parameter_value_unit - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_process_parameter_value_unit = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addProcess_parameter_value_unit.map(associatedRecordId => {
        return {
            unit_fk: this.getIdValue(),
            [models.process_parameter_value.idAttribute()]: associatedRecordId
        }
    });
    await models.process_parameter_value.bulkAssociateProcess_parameter_valueWithUnit_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_assay_technologyType - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_assay_technologyType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addAssay_technologyType.map(associatedRecordId => {
        return {
            technologyType_fk: this.getIdValue(),
            [models.assay.idAttribute()]: associatedRecordId
        }
    });
    await models.assay.bulkAssociateAssayWithTechnologyType_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_component_componentType - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.add_component_componentType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addComponent_componentType.map(associatedRecordId => {
        return {
            componentType_fk: this.getIdValue(),
            [models.component.idAttribute()]: associatedRecordId
        }
    });
    await models.component.bulkAssociateComponentWithComponentType_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_comments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeComments.map(associatedRecordId => {
        return {
            ontology_annotation_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkDisAssociateCommentWithOntology_annotation_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_assay_measurementType - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_assay_measurementType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeAssay_measurementType.map(associatedRecordId => {
        return {
            measurementType_fk: this.getIdValue(),
            [models.assay.idAttribute()]: associatedRecordId
        }
    });
    await models.assay.bulkDisAssociateAssayWithMeasurementType_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_assay_unitCategories - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_assay_unitCategories = async function(input, benignErrorReporter) {

    await ontology_annotation.remove_assay_unitCategories_fk(this.getIdValue(), input.removeAssay_unitCategories, benignErrorReporter);
    this.assay_unitCategories_fk = helper.differenceIds(this.assay_unitCategories_fk, input.removeAssay_unitCategories);
}

/**
 * remove_publication_status - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_publication_status = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removePublication_status.map(associatedRecordId => {
        return {
            status_fk: this.getIdValue(),
            [models.publication.idAttribute()]: associatedRecordId
        }
    });
    await models.publication.bulkDisAssociatePublicationWithStatus_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_person_roles - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_person_roles = async function(input, benignErrorReporter) {

    await ontology_annotation.remove_person_roles_fk(this.getIdValue(), input.removePerson_roles, benignErrorReporter);
    this.person_roles_fk = helper.differenceIds(this.person_roles_fk, input.removePerson_roles);
}

/**
 * remove_study_studyDesignDescriptors - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_study_studyDesignDescriptors = async function(input, benignErrorReporter) {

    await ontology_annotation.remove_study_studyDesignDescriptors_fk(this.getIdValue(), input.removeStudy_studyDesignDescriptors, benignErrorReporter);
    this.study_studyDesignDescriptors_fk = helper.differenceIds(this.study_studyDesignDescriptors_fk, input.removeStudy_studyDesignDescriptors);
}

/**
 * remove_factor_factorType - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_factor_factorType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeFactor_factorType.map(associatedRecordId => {
        return {
            factorType_fk: this.getIdValue(),
            [models.factor.idAttribute()]: associatedRecordId
        }
    });
    await models.factor.bulkDisAssociateFactorWithFactorType_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_study_unitCategories - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_study_unitCategories = async function(input, benignErrorReporter) {

    await ontology_annotation.remove_study_unitCategories_fk(this.getIdValue(), input.removeStudy_unitCategories, benignErrorReporter);
    this.study_unitCategories_fk = helper.differenceIds(this.study_unitCategories_fk, input.removeStudy_unitCategories);
}

/**
 * remove_protocol_protocolType - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_protocol_protocolType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeProtocol_protocolType.map(associatedRecordId => {
        return {
            protocolType_fk: this.getIdValue(),
            [models.protocol.idAttribute()]: associatedRecordId
        }
    });
    await models.protocol.bulkDisAssociateProtocolWithProtocolType_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_protocol_parameter_parameterName - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_protocol_parameter_parameterName = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeProtocol_parameter_parameterName.map(associatedRecordId => {
        return {
            parameterName_fk: this.getIdValue(),
            [models.protocol_parameter.idAttribute()]: associatedRecordId
        }
    });
    await models.protocol_parameter.bulkDisAssociateProtocol_parameterWithParameterName_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_material_attribute_characteristicType - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_material_attribute_characteristicType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeMaterial_attribute_characteristicType.map(associatedRecordId => {
        return {
            characteristicType_fk: this.getIdValue(),
            [models.material_attribute.idAttribute()]: associatedRecordId
        }
    });
    await models.material_attribute.bulkDisAssociateMaterial_attributeWithCharacteristicType_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_material_attribute_value_unit - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_material_attribute_value_unit = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeMaterial_attribute_value_unit.map(associatedRecordId => {
        return {
            unit_fk: this.getIdValue(),
            [models.material_attribute_value.idAttribute()]: associatedRecordId
        }
    });
    await models.material_attribute_value.bulkDisAssociateMaterial_attribute_valueWithUnit_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_factor_value_unit - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_factor_value_unit = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeFactor_value_unit.map(associatedRecordId => {
        return {
            unit_fk: this.getIdValue(),
            [models.factor_value.idAttribute()]: associatedRecordId
        }
    });
    await models.factor_value.bulkDisAssociateFactor_valueWithUnit_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_process_parameter_value_unit - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_process_parameter_value_unit = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeProcess_parameter_value_unit.map(associatedRecordId => {
        return {
            unit_fk: this.getIdValue(),
            [models.process_parameter_value.idAttribute()]: associatedRecordId
        }
    });
    await models.process_parameter_value.bulkDisAssociateProcess_parameter_valueWithUnit_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_assay_technologyType - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_assay_technologyType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeAssay_technologyType.map(associatedRecordId => {
        return {
            technologyType_fk: this.getIdValue(),
            [models.assay.idAttribute()]: associatedRecordId
        }
    });
    await models.assay.bulkDisAssociateAssayWithTechnologyType_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_component_componentType - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontology_annotation.prototype.remove_component_componentType = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeComponent_componentType.map(associatedRecordId => {
        return {
            componentType_fk: this.getIdValue(),
            [models.component.idAttribute()]: associatedRecordId
        }
    });
    await models.component.bulkDisAssociateComponentWithComponentType_fk(bulkAssociationInput, benignErrorReporter);
}



/**
 * countAssociatedRecordsWithRejectReaction - Count associated records with reject deletion action
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAssociatedRecordsWithRejectReaction(id, context) {

    let ontology_annotation = await resolvers.readOneOntology_annotation({
        id: id
    }, context);
    //check that record actually exists
    if (ontology_annotation === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    promises_to_many.push(ontology_annotation.countFilteredComments({}, context));
    promises_to_many.push(ontology_annotation.countFilteredAssay_measurementType({}, context));

    get_to_many_associated_fk += Array.isArray(ontology_annotation.assay_unitCategories_fk) ? ontology_annotation.assay_unitCategories_fk.length : 0;
    promises_to_many.push(ontology_annotation.countFilteredPublication_status({}, context));

    get_to_many_associated_fk += Array.isArray(ontology_annotation.person_roles_fk) ? ontology_annotation.person_roles_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(ontology_annotation.study_studyDesignDescriptors_fk) ? ontology_annotation.study_studyDesignDescriptors_fk.length : 0;
    promises_to_many.push(ontology_annotation.countFilteredFactor_factorType({}, context));

    get_to_many_associated_fk += Array.isArray(ontology_annotation.study_unitCategories_fk) ? ontology_annotation.study_unitCategories_fk.length : 0;
    promises_to_many.push(ontology_annotation.countFilteredProtocol_protocolType({}, context));
    promises_to_many.push(ontology_annotation.countFilteredProtocol_parameter_parameterName({}, context));
    promises_to_many.push(ontology_annotation.countFilteredMaterial_attribute_characteristicType({}, context));
    promises_to_many.push(ontology_annotation.countFilteredMaterial_attribute_value_unit({}, context));
    promises_to_many.push(ontology_annotation.countFilteredFactor_value_unit({}, context));
    promises_to_many.push(ontology_annotation.countFilteredProcess_parameter_value_unit({}, context));
    promises_to_many.push(ontology_annotation.countFilteredAssay_technologyType({}, context));
    promises_to_many.push(ontology_annotation.countFilteredComponent_componentType({}, context));


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
        throw new Error(`ontology_annotation with id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
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
    const ontology_annotation_record = await resolvers.readOneOntology_annotation({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * ontology_annotations - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    ontology_annotations: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'ontology_annotation', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "ontology_annotations");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontology_annotation.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * ontology_annotationsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    ontology_annotationsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'ontology_annotation', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "ontology_annotationsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontology_annotation.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneOntology_annotation - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneOntology_annotation: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'ontology_annotation', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneOntology_annotation");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontology_annotation.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countOntology_annotations - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countOntology_annotations: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'ontology_annotation', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontology_annotation.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateOntology_annotationForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateOntology_annotationForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'ontology_annotation', 'read');
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
                    ontology_annotation,
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
     * validateOntology_annotationForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateOntology_annotationForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'ontology_annotation', 'read');
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
                    ontology_annotation,
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
     * validateOntology_annotationForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateOntology_annotationForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'ontology_annotation', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    ontology_annotation,
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
     * validateOntology_annotationAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateOntology_annotationAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'ontology_annotation', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    ontology_annotation,
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
     * addOntology_annotation - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addOntology_annotation: async function(input, context) {
        let authorization = await checkAuthorization(context, 'ontology_annotation', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdOntology_annotation = await ontology_annotation.addOne(inputSanitized, benignErrorReporter);
            await createdOntology_annotation.handleAssociations(inputSanitized, benignErrorReporter);
            return createdOntology_annotation;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddOntology_annotationCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddOntology_annotationCsv: async function(_, context) {
        if (await checkAuthorization(context, 'ontology_annotation', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return ontology_annotation.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteOntology_annotation - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteOntology_annotation: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'ontology_annotation', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return ontology_annotation.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateOntology_annotation - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateOntology_annotation: async function(input, context) {
        let authorization = await checkAuthorization(context, 'ontology_annotation', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedOntology_annotation = await ontology_annotation.updateOne(inputSanitized, benignErrorReporter);
            await updatedOntology_annotation.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedOntology_annotation;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateOntology_annotation - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateOntology_annotation: async function(_, context) {
        if (await checkAuthorization(context, 'ontology_annotation', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return ontology_annotation.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}