/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const material = require(path.join(__dirname, '..', 'models', 'index.js')).material;
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
    'addCharacteristics': 'material_attribute_value',
    'addDerivesFrom': 'material',
    'addDerived_children': 'material',
    'addComments': 'comment',
    'addProcess_inputs_material': 'process',
    'addProcess_outputs_material': 'process',
    'addAssay_materials_otherMaterials': 'assay',
    'addStudy_materials_otherMaterials': 'study'
}




/**
 * material.prototype.characteristicsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material.prototype.characteristicsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.characteristics_fk) || this.characteristics_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material_attribute_value.idAttribute(),
        "value": this.characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.material_attribute_values({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * material.prototype.countFilteredCharacteristics - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material.prototype.countFilteredCharacteristics = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.characteristics_fk) || this.characteristics_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material_attribute_value.idAttribute(),
        "value": this.characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countMaterial_attribute_values({
        search: nsearch
    }, context);
}

/**
 * material.prototype.characteristicsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material.prototype.characteristicsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.characteristics_fk) || this.characteristics_fk.length === 0) {
        return {
            edges: [],
            material_attribute_values: [],
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
        "field": models.material_attribute_value.idAttribute(),
        "value": this.characteristics_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.material_attribute_valuesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * material.prototype.derivesFromFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material.prototype.derivesFromFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.derivesFrom_fk) || this.derivesFrom_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.derivesFrom_fk.join(','),
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
 * material.prototype.countFilteredDerivesFrom - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material.prototype.countFilteredDerivesFrom = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.derivesFrom_fk) || this.derivesFrom_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.derivesFrom_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countMaterials({
        search: nsearch
    }, context);
}

/**
 * material.prototype.derivesFromConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material.prototype.derivesFromConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.derivesFrom_fk) || this.derivesFrom_fk.length === 0) {
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
        "value": this.derivesFrom_fk.join(','),
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
 * material.prototype.derived_childrenFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material.prototype.derived_childrenFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.derived_children_fk) || this.derived_children_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.derived_children_fk.join(','),
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
 * material.prototype.countFilteredDerived_children - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material.prototype.countFilteredDerived_children = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.derived_children_fk) || this.derived_children_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.derived_children_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countMaterials({
        search: nsearch
    }, context);
}

/**
 * material.prototype.derived_childrenConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material.prototype.derived_childrenConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.derived_children_fk) || this.derived_children_fk.length === 0) {
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
        "value": this.derived_children_fk.join(','),
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
 * material.prototype.commentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material.prototype.commentsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "material_comments_fk",
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
 * material.prototype.countFilteredComments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material.prototype.countFilteredComments = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "material_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countComments({
        search: nsearch
    }, context);
}

/**
 * material.prototype.commentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material.prototype.commentsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "material_comments_fk",
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
 * material.prototype.process_inputs_materialFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material.prototype.process_inputs_materialFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.process_inputs_material_fk) || this.process_inputs_material_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.process.idAttribute(),
        "value": this.process_inputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.processes({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * material.prototype.countFilteredProcess_inputs_material - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material.prototype.countFilteredProcess_inputs_material = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.process_inputs_material_fk) || this.process_inputs_material_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.process.idAttribute(),
        "value": this.process_inputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countProcesses({
        search: nsearch
    }, context);
}

/**
 * material.prototype.process_inputs_materialConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material.prototype.process_inputs_materialConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.process_inputs_material_fk) || this.process_inputs_material_fk.length === 0) {
        return {
            edges: [],
            processes: [],
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
        "field": models.process.idAttribute(),
        "value": this.process_inputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.processesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * material.prototype.process_outputs_materialFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material.prototype.process_outputs_materialFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.process_outputs_material_fk) || this.process_outputs_material_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.process.idAttribute(),
        "value": this.process_outputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.processes({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * material.prototype.countFilteredProcess_outputs_material - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material.prototype.countFilteredProcess_outputs_material = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.process_outputs_material_fk) || this.process_outputs_material_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.process.idAttribute(),
        "value": this.process_outputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countProcesses({
        search: nsearch
    }, context);
}

/**
 * material.prototype.process_outputs_materialConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material.prototype.process_outputs_materialConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.process_outputs_material_fk) || this.process_outputs_material_fk.length === 0) {
        return {
            edges: [],
            processes: [],
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
        "field": models.process.idAttribute(),
        "value": this.process_outputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.processesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * material.prototype.assay_materials_otherMaterialsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material.prototype.assay_materials_otherMaterialsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_materials_otherMaterials_fk) || this.assay_materials_otherMaterials_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.assay.idAttribute(),
        "value": this.assay_materials_otherMaterials_fk.join(','),
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
 * material.prototype.countFilteredAssay_materials_otherMaterials - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material.prototype.countFilteredAssay_materials_otherMaterials = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_materials_otherMaterials_fk) || this.assay_materials_otherMaterials_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.assay.idAttribute(),
        "value": this.assay_materials_otherMaterials_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countAssays({
        search: nsearch
    }, context);
}

/**
 * material.prototype.assay_materials_otherMaterialsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material.prototype.assay_materials_otherMaterialsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_materials_otherMaterials_fk) || this.assay_materials_otherMaterials_fk.length === 0) {
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
        "value": this.assay_materials_otherMaterials_fk.join(','),
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
 * material.prototype.study_materials_otherMaterialsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
material.prototype.study_materials_otherMaterialsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_materials_otherMaterials_fk) || this.study_materials_otherMaterials_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_materials_otherMaterials_fk.join(','),
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
 * material.prototype.countFilteredStudy_materials_otherMaterials - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
material.prototype.countFilteredStudy_materials_otherMaterials = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_materials_otherMaterials_fk) || this.study_materials_otherMaterials_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_materials_otherMaterials_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countStudies({
        search: nsearch
    }, context);
}

/**
 * material.prototype.study_materials_otherMaterialsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
material.prototype.study_materials_otherMaterialsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_materials_otherMaterials_fk) || this.study_materials_otherMaterials_fk.length === 0) {
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
        "value": this.study_materials_otherMaterials_fk.join(','),
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
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addCharacteristics)) {
        promises_add.push(this.add_characteristics(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addDerivesFrom)) {
        promises_add.push(this.add_derivesFrom(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addDerived_children)) {
        promises_add.push(this.add_derived_children(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addComments)) {
        promises_add.push(this.add_comments(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addProcess_inputs_material)) {
        promises_add.push(this.add_process_inputs_material(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addProcess_outputs_material)) {
        promises_add.push(this.add_process_outputs_material(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addAssay_materials_otherMaterials)) {
        promises_add.push(this.add_assay_materials_otherMaterials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addStudy_materials_otherMaterials)) {
        promises_add.push(this.add_study_materials_otherMaterials(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeCharacteristics)) {
        promises_remove.push(this.remove_characteristics(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeDerivesFrom)) {
        promises_remove.push(this.remove_derivesFrom(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeDerived_children)) {
        promises_remove.push(this.remove_derived_children(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeComments)) {
        promises_remove.push(this.remove_comments(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeProcess_inputs_material)) {
        promises_remove.push(this.remove_process_inputs_material(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeProcess_outputs_material)) {
        promises_remove.push(this.remove_process_outputs_material(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeAssay_materials_otherMaterials)) {
        promises_remove.push(this.remove_assay_materials_otherMaterials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeStudy_materials_otherMaterials)) {
        promises_remove.push(this.remove_study_materials_otherMaterials(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_characteristics - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.add_characteristics = async function(input, benignErrorReporter) {

    await material.add_characteristics_fk(this.getIdValue(), input.addCharacteristics, benignErrorReporter);
    this.characteristics_fk = helper.unionIds(this.characteristics_fk, input.addCharacteristics);
}

/**
 * add_derivesFrom - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.add_derivesFrom = async function(input, benignErrorReporter) {

    await material.add_derivesFrom_fk(this.getIdValue(), input.addDerivesFrom, benignErrorReporter);
    this.derivesFrom_fk = helper.unionIds(this.derivesFrom_fk, input.addDerivesFrom);
}

/**
 * add_derived_children - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.add_derived_children = async function(input, benignErrorReporter) {

    await material.add_derived_children_fk(this.getIdValue(), input.addDerived_children, benignErrorReporter);
    this.derived_children_fk = helper.unionIds(this.derived_children_fk, input.addDerived_children);
}

/**
 * add_comments - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.add_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addComments.map(associatedRecordId => {
        return {
            material_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkAssociateCommentWithMaterial_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_process_inputs_material - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.add_process_inputs_material = async function(input, benignErrorReporter) {

    await material.add_process_inputs_material_fk(this.getIdValue(), input.addProcess_inputs_material, benignErrorReporter);
    this.process_inputs_material_fk = helper.unionIds(this.process_inputs_material_fk, input.addProcess_inputs_material);
}

/**
 * add_process_outputs_material - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.add_process_outputs_material = async function(input, benignErrorReporter) {

    await material.add_process_outputs_material_fk(this.getIdValue(), input.addProcess_outputs_material, benignErrorReporter);
    this.process_outputs_material_fk = helper.unionIds(this.process_outputs_material_fk, input.addProcess_outputs_material);
}

/**
 * add_assay_materials_otherMaterials - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.add_assay_materials_otherMaterials = async function(input, benignErrorReporter) {

    await material.add_assay_materials_otherMaterials_fk(this.getIdValue(), input.addAssay_materials_otherMaterials, benignErrorReporter);
    this.assay_materials_otherMaterials_fk = helper.unionIds(this.assay_materials_otherMaterials_fk, input.addAssay_materials_otherMaterials);
}

/**
 * add_study_materials_otherMaterials - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.add_study_materials_otherMaterials = async function(input, benignErrorReporter) {

    await material.add_study_materials_otherMaterials_fk(this.getIdValue(), input.addStudy_materials_otherMaterials, benignErrorReporter);
    this.study_materials_otherMaterials_fk = helper.unionIds(this.study_materials_otherMaterials_fk, input.addStudy_materials_otherMaterials);
}

/**
 * remove_characteristics - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.remove_characteristics = async function(input, benignErrorReporter) {

    await material.remove_characteristics_fk(this.getIdValue(), input.removeCharacteristics, benignErrorReporter);
    this.characteristics_fk = helper.differenceIds(this.characteristics_fk, input.removeCharacteristics);
}

/**
 * remove_derivesFrom - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.remove_derivesFrom = async function(input, benignErrorReporter) {

    await material.remove_derivesFrom_fk(this.getIdValue(), input.removeDerivesFrom, benignErrorReporter);
    this.derivesFrom_fk = helper.differenceIds(this.derivesFrom_fk, input.removeDerivesFrom);
}

/**
 * remove_derived_children - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.remove_derived_children = async function(input, benignErrorReporter) {

    await material.remove_derived_children_fk(this.getIdValue(), input.removeDerived_children, benignErrorReporter);
    this.derived_children_fk = helper.differenceIds(this.derived_children_fk, input.removeDerived_children);
}

/**
 * remove_comments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.remove_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeComments.map(associatedRecordId => {
        return {
            material_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkDisAssociateCommentWithMaterial_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_process_inputs_material - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.remove_process_inputs_material = async function(input, benignErrorReporter) {

    await material.remove_process_inputs_material_fk(this.getIdValue(), input.removeProcess_inputs_material, benignErrorReporter);
    this.process_inputs_material_fk = helper.differenceIds(this.process_inputs_material_fk, input.removeProcess_inputs_material);
}

/**
 * remove_process_outputs_material - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.remove_process_outputs_material = async function(input, benignErrorReporter) {

    await material.remove_process_outputs_material_fk(this.getIdValue(), input.removeProcess_outputs_material, benignErrorReporter);
    this.process_outputs_material_fk = helper.differenceIds(this.process_outputs_material_fk, input.removeProcess_outputs_material);
}

/**
 * remove_assay_materials_otherMaterials - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.remove_assay_materials_otherMaterials = async function(input, benignErrorReporter) {

    await material.remove_assay_materials_otherMaterials_fk(this.getIdValue(), input.removeAssay_materials_otherMaterials, benignErrorReporter);
    this.assay_materials_otherMaterials_fk = helper.differenceIds(this.assay_materials_otherMaterials_fk, input.removeAssay_materials_otherMaterials);
}

/**
 * remove_study_materials_otherMaterials - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
material.prototype.remove_study_materials_otherMaterials = async function(input, benignErrorReporter) {

    await material.remove_study_materials_otherMaterials_fk(this.getIdValue(), input.removeStudy_materials_otherMaterials, benignErrorReporter);
    this.study_materials_otherMaterials_fk = helper.differenceIds(this.study_materials_otherMaterials_fk, input.removeStudy_materials_otherMaterials);
}



/**
 * countAssociatedRecordsWithRejectReaction - Count associated records with reject deletion action
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAssociatedRecordsWithRejectReaction(id, context) {

    let material = await resolvers.readOneMaterial({
        id: id
    }, context);
    //check that record actually exists
    if (material === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;

    get_to_many_associated_fk += Array.isArray(material.characteristics_fk) ? material.characteristics_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(material.derivesFrom_fk) ? material.derivesFrom_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(material.derived_children_fk) ? material.derived_children_fk.length : 0;
    promises_to_many.push(material.countFilteredComments({}, context));

    get_to_many_associated_fk += Array.isArray(material.process_inputs_material_fk) ? material.process_inputs_material_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(material.process_outputs_material_fk) ? material.process_outputs_material_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(material.assay_materials_otherMaterials_fk) ? material.assay_materials_otherMaterials_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(material.study_materials_otherMaterials_fk) ? material.study_materials_otherMaterials_fk.length : 0;


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
        throw new Error(`material with id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
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
    const material_record = await resolvers.readOneMaterial({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * materials - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    materials: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'material', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "materials");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * materialsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    materialsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'material', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "materialsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneMaterial - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneMaterial: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'material', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneMaterial");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countMaterials - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countMaterials: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'material', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await material.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateMaterialForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterialForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'material', 'read');
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
                    material,
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
     * validateMaterialForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterialForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'material', 'read');
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
                    material,
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
     * validateMaterialForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterialForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'material', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    material,
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
     * validateMaterialAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateMaterialAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'material', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    material,
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
     * addMaterial - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addMaterial: async function(input, context) {
        let authorization = await checkAuthorization(context, 'material', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdMaterial = await material.addOne(inputSanitized, benignErrorReporter);
            await createdMaterial.handleAssociations(inputSanitized, benignErrorReporter);
            return createdMaterial;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddMaterialCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddMaterialCsv: async function(_, context) {
        if (await checkAuthorization(context, 'material', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return material.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteMaterial - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteMaterial: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'material', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return material.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateMaterial - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateMaterial: async function(input, context) {
        let authorization = await checkAuthorization(context, 'material', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedMaterial = await material.updateOne(inputSanitized, benignErrorReporter);
            await updatedMaterial.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedMaterial;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateMaterial - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateMaterial: async function(_, context) {
        if (await checkAuthorization(context, 'material', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return material.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}