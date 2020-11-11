/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const ontologyAnnotation = require(path.join(__dirname, '..', 'models', 'index.js')).ontologyAnnotation;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addInvestigations': 'investigation',
    'addStudies': 'study',
    'addAssays': 'assay',
    'addAssayResults': 'assayResult',
    'addFactors': 'factor',
    'addMaterials': 'material',
    'addProtocols': 'protocol',
    'addContacts': 'contact'
}




/**
 * ontologyAnnotation.prototype.investigationsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.investigationsFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.investigation_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.investigation.idAttribute(),
            "value": this.investigation_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.investigations({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * ontologyAnnotation.prototype.countFilteredInvestigations - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyAnnotation.prototype.countFilteredInvestigations = function({
    search
}, context) {


    if (this.investigation_ids.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.investigation.idAttribute(),
        "value": this.investigation_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countInvestigations({
        search: nsearch
    }, context);
}

/**
 * ontologyAnnotation.prototype.investigationsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.investigationsConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.investigation_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.investigation.idAttribute(),
            "value": this.investigation_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.investigationsConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}
/**
 * ontologyAnnotation.prototype.studiesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.studiesFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.study_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.study.idAttribute(),
            "value": this.study_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.studies({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * ontologyAnnotation.prototype.countFilteredStudies - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyAnnotation.prototype.countFilteredStudies = function({
    search
}, context) {


    if (this.study_ids.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countStudies({
        search: nsearch
    }, context);
}

/**
 * ontologyAnnotation.prototype.studiesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.studiesConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.study_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.study.idAttribute(),
            "value": this.study_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.studiesConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}
/**
 * ontologyAnnotation.prototype.assaysFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.assaysFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.assay_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.assay.idAttribute(),
            "value": this.assay_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.assays({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * ontologyAnnotation.prototype.countFilteredAssays - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyAnnotation.prototype.countFilteredAssays = function({
    search
}, context) {


    if (this.assay_ids.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.assay.idAttribute(),
        "value": this.assay_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countAssays({
        search: nsearch
    }, context);
}

/**
 * ontologyAnnotation.prototype.assaysConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.assaysConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.assay_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.assay.idAttribute(),
            "value": this.assay_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.assaysConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}
/**
 * ontologyAnnotation.prototype.assayResultsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.assayResultsFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.assayResult_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.assayResult.idAttribute(),
            "value": this.assayResult_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.assayResults({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * ontologyAnnotation.prototype.countFilteredAssayResults - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyAnnotation.prototype.countFilteredAssayResults = function({
    search
}, context) {


    if (this.assayResult_ids.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.assayResult.idAttribute(),
        "value": this.assayResult_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countAssayResults({
        search: nsearch
    }, context);
}

/**
 * ontologyAnnotation.prototype.assayResultsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.assayResultsConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.assayResult_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.assayResult.idAttribute(),
            "value": this.assayResult_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.assayResultsConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}
/**
 * ontologyAnnotation.prototype.factorsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.factorsFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.factor_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.factor.idAttribute(),
            "value": this.factor_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.factors({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * ontologyAnnotation.prototype.countFilteredFactors - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyAnnotation.prototype.countFilteredFactors = function({
    search
}, context) {


    if (this.factor_ids.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.factor.idAttribute(),
        "value": this.factor_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countFactors({
        search: nsearch
    }, context);
}

/**
 * ontologyAnnotation.prototype.factorsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.factorsConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.factor_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.factor.idAttribute(),
            "value": this.factor_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.factorsConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}
/**
 * ontologyAnnotation.prototype.materialsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.materialsFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.material_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.material.idAttribute(),
            "value": this.material_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.materials({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * ontologyAnnotation.prototype.countFilteredMaterials - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyAnnotation.prototype.countFilteredMaterials = function({
    search
}, context) {


    if (this.material_ids.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.material_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countMaterials({
        search: nsearch
    }, context);
}

/**
 * ontologyAnnotation.prototype.materialsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.materialsConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.material_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.material.idAttribute(),
            "value": this.material_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.materialsConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}
/**
 * ontologyAnnotation.prototype.protocolsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.protocolsFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.protocol_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.protocol.idAttribute(),
            "value": this.protocol_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.protocols({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * ontologyAnnotation.prototype.countFilteredProtocols - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyAnnotation.prototype.countFilteredProtocols = function({
    search
}, context) {


    if (this.protocol_ids.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.protocol.idAttribute(),
        "value": this.protocol_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countProtocols({
        search: nsearch
    }, context);
}

/**
 * ontologyAnnotation.prototype.protocolsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.protocolsConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.protocol_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.protocol.idAttribute(),
            "value": this.protocol_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.protocolsConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}
/**
 * ontologyAnnotation.prototype.contactsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.contactsFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.contact_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.contact.idAttribute(),
            "value": this.contact_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.contacts({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * ontologyAnnotation.prototype.countFilteredContacts - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyAnnotation.prototype.countFilteredContacts = function({
    search
}, context) {


    if (this.contact_ids.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.contact.idAttribute(),
        "value": this.contact_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countContacts({
        search: nsearch
    }, context);
}

/**
 * ontologyAnnotation.prototype.contactsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyAnnotation.prototype.contactsConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.contact_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.contact.idAttribute(),
            "value": this.contact_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.contactsConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addInvestigations)) {
        promises.push(this.add_investigations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addStudies)) {
        promises.push(this.add_studies(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addAssays)) {
        promises.push(this.add_assays(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addAssayResults)) {
        promises.push(this.add_assayResults(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addFactors)) {
        promises.push(this.add_factors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMaterials)) {
        promises.push(this.add_materials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addProtocols)) {
        promises.push(this.add_protocols(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addContacts)) {
        promises.push(this.add_contacts(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeInvestigations)) {
        promises.push(this.remove_investigations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeStudies)) {
        promises.push(this.remove_studies(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeAssays)) {
        promises.push(this.remove_assays(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeAssayResults)) {
        promises.push(this.remove_assayResults(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeFactors)) {
        promises.push(this.remove_factors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMaterials)) {
        promises.push(this.remove_materials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeProtocols)) {
        promises.push(this.remove_protocols(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeContacts)) {
        promises.push(this.remove_contacts(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_investigations - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.add_investigations = async function(input, benignErrorReporter) {

    await ontologyAnnotation.add_investigation_ids(this.getIdValue(), input.addInvestigations, benignErrorReporter);
    this.investigation_ids = helper.unionIds(this.investigation_ids, input.addInvestigations);
}

/**
 * add_studies - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.add_studies = async function(input, benignErrorReporter) {

    await ontologyAnnotation.add_study_ids(this.getIdValue(), input.addStudies, benignErrorReporter);
    this.study_ids = helper.unionIds(this.study_ids, input.addStudies);
}

/**
 * add_assays - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.add_assays = async function(input, benignErrorReporter) {

    await ontologyAnnotation.add_assay_ids(this.getIdValue(), input.addAssays, benignErrorReporter);
    this.assay_ids = helper.unionIds(this.assay_ids, input.addAssays);
}

/**
 * add_assayResults - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.add_assayResults = async function(input, benignErrorReporter) {

    await ontologyAnnotation.add_assayResult_ids(this.getIdValue(), input.addAssayResults, benignErrorReporter);
    this.assayResult_ids = helper.unionIds(this.assayResult_ids, input.addAssayResults);
}

/**
 * add_factors - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.add_factors = async function(input, benignErrorReporter) {

    await ontologyAnnotation.add_factor_ids(this.getIdValue(), input.addFactors, benignErrorReporter);
    this.factor_ids = helper.unionIds(this.factor_ids, input.addFactors);
}

/**
 * add_materials - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.add_materials = async function(input, benignErrorReporter) {

    await ontologyAnnotation.add_material_ids(this.getIdValue(), input.addMaterials, benignErrorReporter);
    this.material_ids = helper.unionIds(this.material_ids, input.addMaterials);
}

/**
 * add_protocols - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.add_protocols = async function(input, benignErrorReporter) {

    await ontologyAnnotation.add_protocol_ids(this.getIdValue(), input.addProtocols, benignErrorReporter);
    this.protocol_ids = helper.unionIds(this.protocol_ids, input.addProtocols);
}

/**
 * add_contacts - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.add_contacts = async function(input, benignErrorReporter) {

    await ontologyAnnotation.add_contact_ids(this.getIdValue(), input.addContacts, benignErrorReporter);
    this.contact_ids = helper.unionIds(this.contact_ids, input.addContacts);
}

/**
 * remove_investigations - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.remove_investigations = async function(input, benignErrorReporter) {

    await ontologyAnnotation.remove_investigation_ids(this.getIdValue(), input.removeInvestigations, benignErrorReporter);
    this.investigation_ids = helper.differenceIds(this.investigation_ids, input.removeInvestigations);
}

/**
 * remove_studies - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.remove_studies = async function(input, benignErrorReporter) {

    await ontologyAnnotation.remove_study_ids(this.getIdValue(), input.removeStudies, benignErrorReporter);
    this.study_ids = helper.differenceIds(this.study_ids, input.removeStudies);
}

/**
 * remove_assays - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.remove_assays = async function(input, benignErrorReporter) {

    await ontologyAnnotation.remove_assay_ids(this.getIdValue(), input.removeAssays, benignErrorReporter);
    this.assay_ids = helper.differenceIds(this.assay_ids, input.removeAssays);
}

/**
 * remove_assayResults - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.remove_assayResults = async function(input, benignErrorReporter) {

    await ontologyAnnotation.remove_assayResult_ids(this.getIdValue(), input.removeAssayResults, benignErrorReporter);
    this.assayResult_ids = helper.differenceIds(this.assayResult_ids, input.removeAssayResults);
}

/**
 * remove_factors - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.remove_factors = async function(input, benignErrorReporter) {

    await ontologyAnnotation.remove_factor_ids(this.getIdValue(), input.removeFactors, benignErrorReporter);
    this.factor_ids = helper.differenceIds(this.factor_ids, input.removeFactors);
}

/**
 * remove_materials - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.remove_materials = async function(input, benignErrorReporter) {

    await ontologyAnnotation.remove_material_ids(this.getIdValue(), input.removeMaterials, benignErrorReporter);
    this.material_ids = helper.differenceIds(this.material_ids, input.removeMaterials);
}

/**
 * remove_protocols - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.remove_protocols = async function(input, benignErrorReporter) {

    await ontologyAnnotation.remove_protocol_ids(this.getIdValue(), input.removeProtocols, benignErrorReporter);
    this.protocol_ids = helper.differenceIds(this.protocol_ids, input.removeProtocols);
}

/**
 * remove_contacts - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyAnnotation.prototype.remove_contacts = async function(input, benignErrorReporter) {

    await ontologyAnnotation.remove_contact_ids(this.getIdValue(), input.removeContacts, benignErrorReporter);
    this.contact_ids = helper.differenceIds(this.contact_ids, input.removeContacts);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let ontologyAnnotation = await resolvers.readOneOntologyAnnotation({
        ontologyAnnotation_id: id
    }, context);
    //check that record actually exists
    if (ontologyAnnotation === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(ontologyAnnotation.countFilteredInvestigations({}, context));
    promises_to_many.push(ontologyAnnotation.countFilteredStudies({}, context));
    promises_to_many.push(ontologyAnnotation.countFilteredAssays({}, context));
    promises_to_many.push(ontologyAnnotation.countFilteredAssayResults({}, context));
    promises_to_many.push(ontologyAnnotation.countFilteredFactors({}, context));
    promises_to_many.push(ontologyAnnotation.countFilteredMaterials({}, context));
    promises_to_many.push(ontologyAnnotation.countFilteredProtocols({}, context));
    promises_to_many.push(ontologyAnnotation.countFilteredContacts({}, context));

    let result_to_many = await Promise.all(promises_to_many);
    let result_to_one = await Promise.all(promises_to_one);

    let get_to_many_associated = result_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);
    let get_to_one_associated = result_to_one.filter((r, index) => helper.isNotUndefinedAndNotNull(r)).length;

    return get_to_one_associated + get_to_many_associated;
}

/**
 * validForDeletion - Checks wether a record is allowed to be deleted
 *
 * @param  {ID} id      Id of record to check if it can be deleted
 * @param  {object} context Default context by resolver
 * @return {boolean}         True if it is allowed to be deleted and false otherwise
 */
async function validForDeletion(id, context) {
    if (await countAllAssociatedRecords(id, context) > 0) {
        throw new Error(`ontologyAnnotation with ontologyAnnotation_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * ontologyAnnotations - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    ontologyAnnotations: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'ontologyAnnotation', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "ontologyAnnotations");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontologyAnnotation.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * ontologyAnnotationsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    ontologyAnnotationsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'ontologyAnnotation', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "ontologyAnnotationsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontologyAnnotation.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneOntologyAnnotation - Check user authorization and return one record with the specified ontologyAnnotation_id in the ontologyAnnotation_id argument.
     *
     * @param  {number} {ontologyAnnotation_id}    ontologyAnnotation_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with ontologyAnnotation_id requested
     */
    readOneOntologyAnnotation: async function({
        ontologyAnnotation_id
    }, context) {
        if (await checkAuthorization(context, 'ontologyAnnotation', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneOntologyAnnotation");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontologyAnnotation.readById(ontologyAnnotation_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countOntologyAnnotations - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countOntologyAnnotations: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'ontologyAnnotation', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontologyAnnotation.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableOntologyAnnotation - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableOntologyAnnotation: async function(_, context) {
        if (await checkAuthorization(context, 'ontologyAnnotation', 'read') === true) {
            return helper.vueTable(context.request, ontologyAnnotation, ["id", "ontologyAnnotation_id", "ontology", "ontologyURL", "term", "termURL"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addOntologyAnnotation - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addOntologyAnnotation: async function(input, context) {
        let authorization = await checkAuthorization(context, 'ontologyAnnotation', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdOntologyAnnotation = await ontologyAnnotation.addOne(inputSanitized, benignErrorReporter);
            await createdOntologyAnnotation.handleAssociations(inputSanitized, benignErrorReporter);
            return createdOntologyAnnotation;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddOntologyAnnotationCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddOntologyAnnotationCsv: async function(_, context) {
        if (await checkAuthorization(context, 'ontologyAnnotation', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return ontologyAnnotation.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteOntologyAnnotation - Check user authorization and delete a record with the specified ontologyAnnotation_id in the ontologyAnnotation_id argument.
     *
     * @param  {number} {ontologyAnnotation_id}    ontologyAnnotation_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteOntologyAnnotation: async function({
        ontologyAnnotation_id
    }, context) {
        if (await checkAuthorization(context, 'ontologyAnnotation', 'delete') === true) {
            if (await validForDeletion(ontologyAnnotation_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return ontologyAnnotation.deleteOne(ontologyAnnotation_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateOntologyAnnotation - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateOntologyAnnotation: async function(input, context) {
        let authorization = await checkAuthorization(context, 'ontologyAnnotation', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedOntologyAnnotation = await ontologyAnnotation.updateOne(inputSanitized, benignErrorReporter);
            await updatedOntologyAnnotation.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedOntologyAnnotation;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateOntologyAnnotation - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateOntologyAnnotation: async function(_, context) {
        if (await checkAuthorization(context, 'ontologyAnnotation', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return ontologyAnnotation.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}