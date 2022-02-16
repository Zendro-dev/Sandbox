/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const assay = require(path.join(__dirname, '..', 'models', 'index.js')).assay;
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
    'addMeasurementType': 'ontology_annotation',
    'addTechnologyType': 'ontology_annotation',
    'addStudy_assays': 'study',
    'addMaterials_otherMaterials': 'material',
    'addMaterials_samples': 'sample',
    'addDataFiles': 'data',
    'addCharacteristicCategories': 'material_attribute',
    'addUnitCategories': 'ontology_annotation',
    'addProcessSequence': 'process',
    'addComments': 'comment'
}



/**
 * assay.prototype.measurementType - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
assay.prototype.measurementType = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.measurementType_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneOntology_annotation({
                [models.ontology_annotation.idAttribute()]: this.measurementType_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.ontology_annotation.idAttribute(),
                "value": this.measurementType_fk,
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
 * assay.prototype.technologyType - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
assay.prototype.technologyType = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.technologyType_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneOntology_annotation({
                [models.ontology_annotation.idAttribute()]: this.technologyType_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.ontology_annotation.idAttribute(),
                "value": this.technologyType_fk,
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
 * assay.prototype.study_assays - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
assay.prototype.study_assays = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.study_assays_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneStudy({
                [models.study.idAttribute()]: this.study_assays_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.study.idAttribute(),
                "value": this.study_assays_fk,
                "operator": "eq"
            });
            let found = (await resolvers.studiesConnection({
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
 * assay.prototype.materials_otherMaterialsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.materials_otherMaterialsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.materials_otherMaterials_fk) || this.materials_otherMaterials_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.materials_otherMaterials_fk.join(','),
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
 * assay.prototype.countFilteredMaterials_otherMaterials - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredMaterials_otherMaterials = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.materials_otherMaterials_fk) || this.materials_otherMaterials_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.materials_otherMaterials_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countMaterials({
        search: nsearch
    }, context);
}

/**
 * assay.prototype.materials_otherMaterialsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.materials_otherMaterialsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.materials_otherMaterials_fk) || this.materials_otherMaterials_fk.length === 0) {
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
        "value": this.materials_otherMaterials_fk.join(','),
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
 * assay.prototype.materials_samplesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.materials_samplesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.materials_samples_fk) || this.materials_samples_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.sample.idAttribute(),
        "value": this.materials_samples_fk.join(','),
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
 * assay.prototype.countFilteredMaterials_samples - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredMaterials_samples = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.materials_samples_fk) || this.materials_samples_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.sample.idAttribute(),
        "value": this.materials_samples_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countSamples({
        search: nsearch
    }, context);
}

/**
 * assay.prototype.materials_samplesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.materials_samplesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.materials_samples_fk) || this.materials_samples_fk.length === 0) {
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
        "value": this.materials_samples_fk.join(','),
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
 * assay.prototype.dataFilesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.dataFilesFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_dataFiles_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.data({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * assay.prototype.countFilteredDataFiles - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredDataFiles = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_dataFiles_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countData({
        search: nsearch
    }, context);
}

/**
 * assay.prototype.dataFilesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.dataFilesConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_dataFiles_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.dataConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * assay.prototype.characteristicCategoriesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.characteristicCategoriesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.characteristicCategories_fk) || this.characteristicCategories_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material_attribute.idAttribute(),
        "value": this.characteristicCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.material_attributes({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * assay.prototype.countFilteredCharacteristicCategories - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredCharacteristicCategories = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.characteristicCategories_fk) || this.characteristicCategories_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material_attribute.idAttribute(),
        "value": this.characteristicCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countMaterial_attributes({
        search: nsearch
    }, context);
}

/**
 * assay.prototype.characteristicCategoriesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.characteristicCategoriesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.characteristicCategories_fk) || this.characteristicCategories_fk.length === 0) {
        return {
            edges: [],
            material_attributes: [],
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
        "field": models.material_attribute.idAttribute(),
        "value": this.characteristicCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.material_attributesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * assay.prototype.unitCategoriesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.unitCategoriesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.unitCategories_fk) || this.unitCategories_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.ontology_annotation.idAttribute(),
        "value": this.unitCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.ontology_annotations({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * assay.prototype.countFilteredUnitCategories - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredUnitCategories = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.unitCategories_fk) || this.unitCategories_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.ontology_annotation.idAttribute(),
        "value": this.unitCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countOntology_annotations({
        search: nsearch
    }, context);
}

/**
 * assay.prototype.unitCategoriesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.unitCategoriesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.unitCategories_fk) || this.unitCategories_fk.length === 0) {
        return {
            edges: [],
            ontology_annotations: [],
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
        "field": models.ontology_annotation.idAttribute(),
        "value": this.unitCategories_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.ontology_annotationsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * assay.prototype.processSequenceFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.processSequenceFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_processSequence_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.processes({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * assay.prototype.countFilteredProcessSequence - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredProcessSequence = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_processSequence_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countProcesses({
        search: nsearch
    }, context);
}

/**
 * assay.prototype.processSequenceConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.processSequenceConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_processSequence_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.processesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * assay.prototype.commentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.commentsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_comments_fk",
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
 * assay.prototype.countFilteredComments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredComments = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countComments({
        search: nsearch
    }, context);
}

/**
 * assay.prototype.commentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.commentsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_comments_fk",
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
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addMaterials_otherMaterials)) {
        promises_add.push(this.add_materials_otherMaterials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMaterials_samples)) {
        promises_add.push(this.add_materials_samples(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addDataFiles)) {
        promises_add.push(this.add_dataFiles(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addCharacteristicCategories)) {
        promises_add.push(this.add_characteristicCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addUnitCategories)) {
        promises_add.push(this.add_unitCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addProcessSequence)) {
        promises_add.push(this.add_processSequence(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addComments)) {
        promises_add.push(this.add_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addMeasurementType)) {
        promises_add.push(this.add_measurementType(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addTechnologyType)) {
        promises_add.push(this.add_technologyType(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addStudy_assays)) {
        promises_add.push(this.add_study_assays(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeMaterials_otherMaterials)) {
        promises_remove.push(this.remove_materials_otherMaterials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMaterials_samples)) {
        promises_remove.push(this.remove_materials_samples(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeDataFiles)) {
        promises_remove.push(this.remove_dataFiles(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeCharacteristicCategories)) {
        promises_remove.push(this.remove_characteristicCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeUnitCategories)) {
        promises_remove.push(this.remove_unitCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeProcessSequence)) {
        promises_remove.push(this.remove_processSequence(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeComments)) {
        promises_remove.push(this.remove_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeMeasurementType)) {
        promises_remove.push(this.remove_measurementType(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeTechnologyType)) {
        promises_remove.push(this.remove_technologyType(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeStudy_assays)) {
        promises_remove.push(this.remove_study_assays(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_materials_otherMaterials - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_materials_otherMaterials = async function(input, benignErrorReporter) {

    await assay.add_materials_otherMaterials_fk(this.getIdValue(), input.addMaterials_otherMaterials, benignErrorReporter);
    this.materials_otherMaterials_fk = helper.unionIds(this.materials_otherMaterials_fk, input.addMaterials_otherMaterials);
}

/**
 * add_materials_samples - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_materials_samples = async function(input, benignErrorReporter) {

    await assay.add_materials_samples_fk(this.getIdValue(), input.addMaterials_samples, benignErrorReporter);
    this.materials_samples_fk = helper.unionIds(this.materials_samples_fk, input.addMaterials_samples);
}

/**
 * add_dataFiles - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_dataFiles = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addDataFiles.map(associatedRecordId => {
        return {
            assay_dataFiles_fk: this.getIdValue(),
            [models.data.idAttribute()]: associatedRecordId
        }
    });
    await models.data.bulkAssociateDataWithAssay_dataFiles_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_characteristicCategories - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_characteristicCategories = async function(input, benignErrorReporter) {

    await assay.add_characteristicCategories_fk(this.getIdValue(), input.addCharacteristicCategories, benignErrorReporter);
    this.characteristicCategories_fk = helper.unionIds(this.characteristicCategories_fk, input.addCharacteristicCategories);
}

/**
 * add_unitCategories - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_unitCategories = async function(input, benignErrorReporter) {

    await assay.add_unitCategories_fk(this.getIdValue(), input.addUnitCategories, benignErrorReporter);
    this.unitCategories_fk = helper.unionIds(this.unitCategories_fk, input.addUnitCategories);
}

/**
 * add_processSequence - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_processSequence = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addProcessSequence.map(associatedRecordId => {
        return {
            assay_processSequence_fk: this.getIdValue(),
            [models.process.idAttribute()]: associatedRecordId
        }
    });
    await models.process.bulkAssociateProcessWithAssay_processSequence_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_comments - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addComments.map(associatedRecordId => {
        return {
            assay_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkAssociateCommentWithAssay_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_measurementType - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_measurementType = async function(input, benignErrorReporter) {
    await assay.add_measurementType_fk(this.getIdValue(), input.addMeasurementType, benignErrorReporter);
    this.measurementType_fk = input.addMeasurementType;
}

/**
 * add_technologyType - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_technologyType = async function(input, benignErrorReporter) {
    await assay.add_technologyType_fk(this.getIdValue(), input.addTechnologyType, benignErrorReporter);
    this.technologyType_fk = input.addTechnologyType;
}

/**
 * add_study_assays - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_study_assays = async function(input, benignErrorReporter) {
    await assay.add_study_assays_fk(this.getIdValue(), input.addStudy_assays, benignErrorReporter);
    this.study_assays_fk = input.addStudy_assays;
}

/**
 * remove_materials_otherMaterials - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_materials_otherMaterials = async function(input, benignErrorReporter) {

    await assay.remove_materials_otherMaterials_fk(this.getIdValue(), input.removeMaterials_otherMaterials, benignErrorReporter);
    this.materials_otherMaterials_fk = helper.differenceIds(this.materials_otherMaterials_fk, input.removeMaterials_otherMaterials);
}

/**
 * remove_materials_samples - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_materials_samples = async function(input, benignErrorReporter) {

    await assay.remove_materials_samples_fk(this.getIdValue(), input.removeMaterials_samples, benignErrorReporter);
    this.materials_samples_fk = helper.differenceIds(this.materials_samples_fk, input.removeMaterials_samples);
}

/**
 * remove_dataFiles - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_dataFiles = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeDataFiles.map(associatedRecordId => {
        return {
            assay_dataFiles_fk: this.getIdValue(),
            [models.data.idAttribute()]: associatedRecordId
        }
    });
    await models.data.bulkDisAssociateDataWithAssay_dataFiles_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_characteristicCategories - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_characteristicCategories = async function(input, benignErrorReporter) {

    await assay.remove_characteristicCategories_fk(this.getIdValue(), input.removeCharacteristicCategories, benignErrorReporter);
    this.characteristicCategories_fk = helper.differenceIds(this.characteristicCategories_fk, input.removeCharacteristicCategories);
}

/**
 * remove_unitCategories - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_unitCategories = async function(input, benignErrorReporter) {

    await assay.remove_unitCategories_fk(this.getIdValue(), input.removeUnitCategories, benignErrorReporter);
    this.unitCategories_fk = helper.differenceIds(this.unitCategories_fk, input.removeUnitCategories);
}

/**
 * remove_processSequence - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_processSequence = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeProcessSequence.map(associatedRecordId => {
        return {
            assay_processSequence_fk: this.getIdValue(),
            [models.process.idAttribute()]: associatedRecordId
        }
    });
    await models.process.bulkDisAssociateProcessWithAssay_processSequence_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_comments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeComments.map(associatedRecordId => {
        return {
            assay_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkDisAssociateCommentWithAssay_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_measurementType - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_measurementType = async function(input, benignErrorReporter) {
    if (input.removeMeasurementType == this.measurementType_fk) {
        await assay.remove_measurementType_fk(this.getIdValue(), input.removeMeasurementType, benignErrorReporter);
        this.measurementType_fk = null;
    }
}

/**
 * remove_technologyType - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_technologyType = async function(input, benignErrorReporter) {
    if (input.removeTechnologyType == this.technologyType_fk) {
        await assay.remove_technologyType_fk(this.getIdValue(), input.removeTechnologyType, benignErrorReporter);
        this.technologyType_fk = null;
    }
}

/**
 * remove_study_assays - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_study_assays = async function(input, benignErrorReporter) {
    if (input.removeStudy_assays == this.study_assays_fk) {
        await assay.remove_study_assays_fk(this.getIdValue(), input.removeStudy_assays, benignErrorReporter);
        this.study_assays_fk = null;
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

    let assay = await resolvers.readOneAssay({
        id: id
    }, context);
    //check that record actually exists
    if (assay === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;

    get_to_many_associated_fk += Array.isArray(assay.materials_otherMaterials_fk) ? assay.materials_otherMaterials_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(assay.materials_samples_fk) ? assay.materials_samples_fk.length : 0;
    promises_to_many.push(assay.countFilteredDataFiles({}, context));

    get_to_many_associated_fk += Array.isArray(assay.characteristicCategories_fk) ? assay.characteristicCategories_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(assay.unitCategories_fk) ? assay.unitCategories_fk.length : 0;
    promises_to_many.push(assay.countFilteredProcessSequence({}, context));
    promises_to_many.push(assay.countFilteredComments({}, context));
    promises_to_one.push(assay.measurementType({}, context));
    promises_to_one.push(assay.technologyType({}, context));
    promises_to_one.push(assay.study_assays({}, context));


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
        throw new Error(`assay with id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
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
    const assay_record = await resolvers.readOneAssay({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * assays - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    assays: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'assay', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "assays");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assay.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * assaysConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    assaysConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'assay', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "assaysConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assay.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneAssay - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneAssay: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'assay', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneAssay");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assay.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countAssays - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countAssays: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'assay', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assay.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateAssayForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateAssayForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'assay', 'read');
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
                    assay,
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
     * validateAssayForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateAssayForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'assay', 'read');
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
                    assay,
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
     * validateAssayForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateAssayForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'assay', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    assay,
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
     * validateAssayAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateAssayAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'assay', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    assay,
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
     * addAssay - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addAssay: async function(input, context) {
        let authorization = await checkAuthorization(context, 'assay', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdAssay = await assay.addOne(inputSanitized, benignErrorReporter);
            await createdAssay.handleAssociations(inputSanitized, benignErrorReporter);
            return createdAssay;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddAssayCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddAssayCsv: async function(_, context) {
        if (await checkAuthorization(context, 'assay', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return assay.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteAssay - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteAssay: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'assay', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return assay.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateAssay - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateAssay: async function(input, context) {
        let authorization = await checkAuthorization(context, 'assay', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedAssay = await assay.updateOne(inputSanitized, benignErrorReporter);
            await updatedAssay.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedAssay;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateAssayWithMeasurementType_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateAssayWithMeasurementType_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                measurementType_fk
            }) => measurementType_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), assay);
        }
        return await assay.bulkAssociateAssayWithMeasurementType_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateAssayWithTechnologyType_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateAssayWithTechnologyType_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                technologyType_fk
            }) => technologyType_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), assay);
        }
        return await assay.bulkAssociateAssayWithTechnologyType_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateAssayWithStudy_assays_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateAssayWithStudy_assays_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_assays_fk
            }) => study_assays_fk)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), assay);
        }
        return await assay.bulkAssociateAssayWithStudy_assays_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateAssayWithMeasurementType_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateAssayWithMeasurementType_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                measurementType_fk
            }) => measurementType_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), assay);
        }
        return await assay.bulkDisAssociateAssayWithMeasurementType_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateAssayWithTechnologyType_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateAssayWithTechnologyType_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                technologyType_fk
            }) => technologyType_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), assay);
        }
        return await assay.bulkDisAssociateAssayWithTechnologyType_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateAssayWithStudy_assays_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateAssayWithStudy_assays_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_assays_fk
            }) => study_assays_fk)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), assay);
        }
        return await assay.bulkDisAssociateAssayWithStudy_assays_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateAssay - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateAssay: async function(_, context) {
        if (await checkAuthorization(context, 'assay', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return assay.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}