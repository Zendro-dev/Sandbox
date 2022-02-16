/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const study = require(path.join(__dirname, '..', 'models', 'index.js')).study;
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
    'addInvestigation_studies': 'investigation',
    'addMaterials_sources': 'source',
    'addMaterials_samples': 'sample',
    'addMaterials_otherMaterials': 'material',
    'addPublications': 'publication',
    'addPeople': 'person',
    'addStudyDesignDescriptors': 'ontology_annotation',
    'addProtocols': 'protocol',
    'addProcessSequence': 'process',
    'addAssays': 'assay',
    'addFactors': 'factor',
    'addCharacteristicCategories': 'material_attribute',
    'addUnitCategories': 'ontology_annotation',
    'addComments': 'comment'
}



/**
 * study.prototype.investigation_studies - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
study.prototype.investigation_studies = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.investigation_studies_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneInvestigation({
                [models.investigation.idAttribute()]: this.investigation_studies_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.investigation.idAttribute(),
                "value": this.investigation_studies_fk,
                "operator": "eq"
            });
            let found = (await resolvers.investigationsConnection({
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
 * study.prototype.materials_sourcesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.materials_sourcesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.materials_sources_fk) || this.materials_sources_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.source.idAttribute(),
        "value": this.materials_sources_fk.join(','),
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
 * study.prototype.countFilteredMaterials_sources - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredMaterials_sources = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.materials_sources_fk) || this.materials_sources_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.source.idAttribute(),
        "value": this.materials_sources_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countSources({
        search: nsearch
    }, context);
}

/**
 * study.prototype.materials_sourcesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.materials_sourcesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.materials_sources_fk) || this.materials_sources_fk.length === 0) {
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
        "value": this.materials_sources_fk.join(','),
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
 * study.prototype.materials_samplesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.materials_samplesFilter = function({
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
 * study.prototype.countFilteredMaterials_samples - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredMaterials_samples = function({
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
 * study.prototype.materials_samplesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.materials_samplesConnection = function({
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
 * study.prototype.materials_otherMaterialsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.materials_otherMaterialsFilter = function({
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
 * study.prototype.countFilteredMaterials_otherMaterials - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredMaterials_otherMaterials = function({
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
 * study.prototype.materials_otherMaterialsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.materials_otherMaterialsConnection = function({
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
 * study.prototype.publicationsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.publicationsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.publications_fk) || this.publications_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.publication.idAttribute(),
        "value": this.publications_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.publications({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredPublications - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredPublications = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.publications_fk) || this.publications_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.publication.idAttribute(),
        "value": this.publications_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countPublications({
        search: nsearch
    }, context);
}

/**
 * study.prototype.publicationsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.publicationsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.publications_fk) || this.publications_fk.length === 0) {
        return {
            edges: [],
            publications: [],
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
        "field": models.publication.idAttribute(),
        "value": this.publications_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.publicationsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.peopleFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.peopleFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.people_fk) || this.people_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.person.idAttribute(),
        "value": this.people_fk.join(','),
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
 * study.prototype.countFilteredPeople - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredPeople = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.people_fk) || this.people_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.person.idAttribute(),
        "value": this.people_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countPeople({
        search: nsearch
    }, context);
}

/**
 * study.prototype.peopleConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.peopleConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.people_fk) || this.people_fk.length === 0) {
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
        "value": this.people_fk.join(','),
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
 * study.prototype.studyDesignDescriptorsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.studyDesignDescriptorsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.studyDesignDescriptors_fk) || this.studyDesignDescriptors_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.ontology_annotation.idAttribute(),
        "value": this.studyDesignDescriptors_fk.join(','),
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
 * study.prototype.countFilteredStudyDesignDescriptors - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredStudyDesignDescriptors = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.studyDesignDescriptors_fk) || this.studyDesignDescriptors_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.ontology_annotation.idAttribute(),
        "value": this.studyDesignDescriptors_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countOntology_annotations({
        search: nsearch
    }, context);
}

/**
 * study.prototype.studyDesignDescriptorsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.studyDesignDescriptorsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.studyDesignDescriptors_fk) || this.studyDesignDescriptors_fk.length === 0) {
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
        "value": this.studyDesignDescriptors_fk.join(','),
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
 * study.prototype.protocolsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.protocolsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.protocols_fk) || this.protocols_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.protocol.idAttribute(),
        "value": this.protocols_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.protocols({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredProtocols - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredProtocols = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.protocols_fk) || this.protocols_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.protocol.idAttribute(),
        "value": this.protocols_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countProtocols({
        search: nsearch
    }, context);
}

/**
 * study.prototype.protocolsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.protocolsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.protocols_fk) || this.protocols_fk.length === 0) {
        return {
            edges: [],
            protocols: [],
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
        "field": models.protocol.idAttribute(),
        "value": this.protocols_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.protocolsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.processSequenceFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.processSequenceFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_processSequence_fk",
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
 * study.prototype.countFilteredProcessSequence - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredProcessSequence = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_processSequence_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countProcesses({
        search: nsearch
    }, context);
}

/**
 * study.prototype.processSequenceConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.processSequenceConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_processSequence_fk",
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
 * study.prototype.assaysFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.assaysFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_assays_fk",
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
 * study.prototype.countFilteredAssays - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredAssays = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_assays_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countAssays({
        search: nsearch
    }, context);
}

/**
 * study.prototype.assaysConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.assaysConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_assays_fk",
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
 * study.prototype.factorsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.factorsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.factors_fk) || this.factors_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.factor.idAttribute(),
        "value": this.factors_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.factors({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredFactors - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredFactors = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.factors_fk) || this.factors_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.factor.idAttribute(),
        "value": this.factors_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countFactors({
        search: nsearch
    }, context);
}

/**
 * study.prototype.factorsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.factorsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.factors_fk) || this.factors_fk.length === 0) {
        return {
            edges: [],
            factors: [],
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
        "field": models.factor.idAttribute(),
        "value": this.factors_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.factorsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.characteristicCategoriesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.characteristicCategoriesFilter = function({
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
 * study.prototype.countFilteredCharacteristicCategories - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredCharacteristicCategories = function({
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
 * study.prototype.characteristicCategoriesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.characteristicCategoriesConnection = function({
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
 * study.prototype.unitCategoriesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.unitCategoriesFilter = function({
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
 * study.prototype.countFilteredUnitCategories - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredUnitCategories = function({
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
 * study.prototype.unitCategoriesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.unitCategoriesConnection = function({
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
 * study.prototype.commentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.commentsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_comments_fk",
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
 * study.prototype.countFilteredComments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredComments = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countComments({
        search: nsearch
    }, context);
}

/**
 * study.prototype.commentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.commentsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_comments_fk",
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
study.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addMaterials_sources)) {
        promises_add.push(this.add_materials_sources(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMaterials_samples)) {
        promises_add.push(this.add_materials_samples(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMaterials_otherMaterials)) {
        promises_add.push(this.add_materials_otherMaterials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addPublications)) {
        promises_add.push(this.add_publications(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addPeople)) {
        promises_add.push(this.add_people(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addStudyDesignDescriptors)) {
        promises_add.push(this.add_studyDesignDescriptors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addProtocols)) {
        promises_add.push(this.add_protocols(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addProcessSequence)) {
        promises_add.push(this.add_processSequence(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addAssays)) {
        promises_add.push(this.add_assays(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addFactors)) {
        promises_add.push(this.add_factors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addCharacteristicCategories)) {
        promises_add.push(this.add_characteristicCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addUnitCategories)) {
        promises_add.push(this.add_unitCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addComments)) {
        promises_add.push(this.add_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addInvestigation_studies)) {
        promises_add.push(this.add_investigation_studies(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeMaterials_sources)) {
        promises_remove.push(this.remove_materials_sources(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMaterials_samples)) {
        promises_remove.push(this.remove_materials_samples(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMaterials_otherMaterials)) {
        promises_remove.push(this.remove_materials_otherMaterials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removePublications)) {
        promises_remove.push(this.remove_publications(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removePeople)) {
        promises_remove.push(this.remove_people(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeStudyDesignDescriptors)) {
        promises_remove.push(this.remove_studyDesignDescriptors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeProtocols)) {
        promises_remove.push(this.remove_protocols(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeProcessSequence)) {
        promises_remove.push(this.remove_processSequence(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeAssays)) {
        promises_remove.push(this.remove_assays(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeFactors)) {
        promises_remove.push(this.remove_factors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeCharacteristicCategories)) {
        promises_remove.push(this.remove_characteristicCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeUnitCategories)) {
        promises_remove.push(this.remove_unitCategories(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeComments)) {
        promises_remove.push(this.remove_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeInvestigation_studies)) {
        promises_remove.push(this.remove_investigation_studies(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_materials_sources - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_materials_sources = async function(input, benignErrorReporter) {

    await study.add_materials_sources_fk(this.getIdValue(), input.addMaterials_sources, benignErrorReporter);
    this.materials_sources_fk = helper.unionIds(this.materials_sources_fk, input.addMaterials_sources);
}

/**
 * add_materials_samples - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_materials_samples = async function(input, benignErrorReporter) {

    await study.add_materials_samples_fk(this.getIdValue(), input.addMaterials_samples, benignErrorReporter);
    this.materials_samples_fk = helper.unionIds(this.materials_samples_fk, input.addMaterials_samples);
}

/**
 * add_materials_otherMaterials - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_materials_otherMaterials = async function(input, benignErrorReporter) {

    await study.add_materials_otherMaterials_fk(this.getIdValue(), input.addMaterials_otherMaterials, benignErrorReporter);
    this.materials_otherMaterials_fk = helper.unionIds(this.materials_otherMaterials_fk, input.addMaterials_otherMaterials);
}

/**
 * add_publications - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_publications = async function(input, benignErrorReporter) {

    await study.add_publications_fk(this.getIdValue(), input.addPublications, benignErrorReporter);
    this.publications_fk = helper.unionIds(this.publications_fk, input.addPublications);
}

/**
 * add_people - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_people = async function(input, benignErrorReporter) {

    await study.add_people_fk(this.getIdValue(), input.addPeople, benignErrorReporter);
    this.people_fk = helper.unionIds(this.people_fk, input.addPeople);
}

/**
 * add_studyDesignDescriptors - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_studyDesignDescriptors = async function(input, benignErrorReporter) {

    await study.add_studyDesignDescriptors_fk(this.getIdValue(), input.addStudyDesignDescriptors, benignErrorReporter);
    this.studyDesignDescriptors_fk = helper.unionIds(this.studyDesignDescriptors_fk, input.addStudyDesignDescriptors);
}

/**
 * add_protocols - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_protocols = async function(input, benignErrorReporter) {

    await study.add_protocols_fk(this.getIdValue(), input.addProtocols, benignErrorReporter);
    this.protocols_fk = helper.unionIds(this.protocols_fk, input.addProtocols);
}

/**
 * add_processSequence - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_processSequence = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addProcessSequence.map(associatedRecordId => {
        return {
            study_processSequence_fk: this.getIdValue(),
            [models.process.idAttribute()]: associatedRecordId
        }
    });
    await models.process.bulkAssociateProcessWithStudy_processSequence_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_assays - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_assays = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addAssays.map(associatedRecordId => {
        return {
            study_assays_fk: this.getIdValue(),
            [models.assay.idAttribute()]: associatedRecordId
        }
    });
    await models.assay.bulkAssociateAssayWithStudy_assays_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_factors - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_factors = async function(input, benignErrorReporter) {

    await study.add_factors_fk(this.getIdValue(), input.addFactors, benignErrorReporter);
    this.factors_fk = helper.unionIds(this.factors_fk, input.addFactors);
}

/**
 * add_characteristicCategories - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_characteristicCategories = async function(input, benignErrorReporter) {

    await study.add_characteristicCategories_fk(this.getIdValue(), input.addCharacteristicCategories, benignErrorReporter);
    this.characteristicCategories_fk = helper.unionIds(this.characteristicCategories_fk, input.addCharacteristicCategories);
}

/**
 * add_unitCategories - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_unitCategories = async function(input, benignErrorReporter) {

    await study.add_unitCategories_fk(this.getIdValue(), input.addUnitCategories, benignErrorReporter);
    this.unitCategories_fk = helper.unionIds(this.unitCategories_fk, input.addUnitCategories);
}

/**
 * add_comments - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addComments.map(associatedRecordId => {
        return {
            study_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkAssociateCommentWithStudy_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_investigation_studies - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_investigation_studies = async function(input, benignErrorReporter) {
    await study.add_investigation_studies_fk(this.getIdValue(), input.addInvestigation_studies, benignErrorReporter);
    this.investigation_studies_fk = input.addInvestigation_studies;
}

/**
 * remove_materials_sources - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_materials_sources = async function(input, benignErrorReporter) {

    await study.remove_materials_sources_fk(this.getIdValue(), input.removeMaterials_sources, benignErrorReporter);
    this.materials_sources_fk = helper.differenceIds(this.materials_sources_fk, input.removeMaterials_sources);
}

/**
 * remove_materials_samples - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_materials_samples = async function(input, benignErrorReporter) {

    await study.remove_materials_samples_fk(this.getIdValue(), input.removeMaterials_samples, benignErrorReporter);
    this.materials_samples_fk = helper.differenceIds(this.materials_samples_fk, input.removeMaterials_samples);
}

/**
 * remove_materials_otherMaterials - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_materials_otherMaterials = async function(input, benignErrorReporter) {

    await study.remove_materials_otherMaterials_fk(this.getIdValue(), input.removeMaterials_otherMaterials, benignErrorReporter);
    this.materials_otherMaterials_fk = helper.differenceIds(this.materials_otherMaterials_fk, input.removeMaterials_otherMaterials);
}

/**
 * remove_publications - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_publications = async function(input, benignErrorReporter) {

    await study.remove_publications_fk(this.getIdValue(), input.removePublications, benignErrorReporter);
    this.publications_fk = helper.differenceIds(this.publications_fk, input.removePublications);
}

/**
 * remove_people - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_people = async function(input, benignErrorReporter) {

    await study.remove_people_fk(this.getIdValue(), input.removePeople, benignErrorReporter);
    this.people_fk = helper.differenceIds(this.people_fk, input.removePeople);
}

/**
 * remove_studyDesignDescriptors - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_studyDesignDescriptors = async function(input, benignErrorReporter) {

    await study.remove_studyDesignDescriptors_fk(this.getIdValue(), input.removeStudyDesignDescriptors, benignErrorReporter);
    this.studyDesignDescriptors_fk = helper.differenceIds(this.studyDesignDescriptors_fk, input.removeStudyDesignDescriptors);
}

/**
 * remove_protocols - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_protocols = async function(input, benignErrorReporter) {

    await study.remove_protocols_fk(this.getIdValue(), input.removeProtocols, benignErrorReporter);
    this.protocols_fk = helper.differenceIds(this.protocols_fk, input.removeProtocols);
}

/**
 * remove_processSequence - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_processSequence = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeProcessSequence.map(associatedRecordId => {
        return {
            study_processSequence_fk: this.getIdValue(),
            [models.process.idAttribute()]: associatedRecordId
        }
    });
    await models.process.bulkDisAssociateProcessWithStudy_processSequence_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_assays - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_assays = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeAssays.map(associatedRecordId => {
        return {
            study_assays_fk: this.getIdValue(),
            [models.assay.idAttribute()]: associatedRecordId
        }
    });
    await models.assay.bulkDisAssociateAssayWithStudy_assays_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_factors - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_factors = async function(input, benignErrorReporter) {

    await study.remove_factors_fk(this.getIdValue(), input.removeFactors, benignErrorReporter);
    this.factors_fk = helper.differenceIds(this.factors_fk, input.removeFactors);
}

/**
 * remove_characteristicCategories - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_characteristicCategories = async function(input, benignErrorReporter) {

    await study.remove_characteristicCategories_fk(this.getIdValue(), input.removeCharacteristicCategories, benignErrorReporter);
    this.characteristicCategories_fk = helper.differenceIds(this.characteristicCategories_fk, input.removeCharacteristicCategories);
}

/**
 * remove_unitCategories - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_unitCategories = async function(input, benignErrorReporter) {

    await study.remove_unitCategories_fk(this.getIdValue(), input.removeUnitCategories, benignErrorReporter);
    this.unitCategories_fk = helper.differenceIds(this.unitCategories_fk, input.removeUnitCategories);
}

/**
 * remove_comments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeComments.map(associatedRecordId => {
        return {
            study_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkDisAssociateCommentWithStudy_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_investigation_studies - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_investigation_studies = async function(input, benignErrorReporter) {
    if (input.removeInvestigation_studies == this.investigation_studies_fk) {
        await study.remove_investigation_studies_fk(this.getIdValue(), input.removeInvestigation_studies, benignErrorReporter);
        this.investigation_studies_fk = null;
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

    let study = await resolvers.readOneStudy({
        id: id
    }, context);
    //check that record actually exists
    if (study === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;

    get_to_many_associated_fk += Array.isArray(study.materials_sources_fk) ? study.materials_sources_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(study.materials_samples_fk) ? study.materials_samples_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(study.materials_otherMaterials_fk) ? study.materials_otherMaterials_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(study.publications_fk) ? study.publications_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(study.people_fk) ? study.people_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(study.studyDesignDescriptors_fk) ? study.studyDesignDescriptors_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(study.protocols_fk) ? study.protocols_fk.length : 0;
    promises_to_many.push(study.countFilteredProcessSequence({}, context));
    promises_to_many.push(study.countFilteredAssays({}, context));

    get_to_many_associated_fk += Array.isArray(study.factors_fk) ? study.factors_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(study.characteristicCategories_fk) ? study.characteristicCategories_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(study.unitCategories_fk) ? study.unitCategories_fk.length : 0;
    promises_to_many.push(study.countFilteredComments({}, context));
    promises_to_one.push(study.investigation_studies({}, context));


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
        throw new Error(`study with id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
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
    const study_record = await resolvers.readOneStudy({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * studies - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    studies: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "studies");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await study.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * studiesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    studiesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "studiesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await study.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneStudy - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneStudy: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneStudy");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await study.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countStudies - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countStudies: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await study.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateStudyForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateStudyForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'study', 'read');
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
                    study,
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
     * validateStudyForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateStudyForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'study', 'read');
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
                    study,
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
     * validateStudyForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateStudyForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'study', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    study,
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
     * validateStudyAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateStudyAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'study', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    study,
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
     * addStudy - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addStudy: async function(input, context) {
        let authorization = await checkAuthorization(context, 'study', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdStudy = await study.addOne(inputSanitized, benignErrorReporter);
            await createdStudy.handleAssociations(inputSanitized, benignErrorReporter);
            return createdStudy;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddStudyCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddStudyCsv: async function(_, context) {
        if (await checkAuthorization(context, 'study', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return study.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteStudy - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteStudy: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'study', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return study.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateStudy - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateStudy: async function(input, context) {
        let authorization = await checkAuthorization(context, 'study', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedStudy = await study.updateOne(inputSanitized, benignErrorReporter);
            await updatedStudy.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedStudy;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateStudyWithInvestigation_studies_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateStudyWithInvestigation_studies_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                investigation_studies_fk
            }) => investigation_studies_fk)), models.investigation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), study);
        }
        return await study.bulkAssociateStudyWithInvestigation_studies_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateStudyWithInvestigation_studies_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateStudyWithInvestigation_studies_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                investigation_studies_fk
            }) => investigation_studies_fk)), models.investigation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), study);
        }
        return await study.bulkDisAssociateStudyWithInvestigation_studies_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateStudy - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateStudy: async function(_, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return study.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}