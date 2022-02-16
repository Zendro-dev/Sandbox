/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const comment = require(path.join(__dirname, '..', 'models', 'index.js')).comment;
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
    'addOntology_annotation_comments': 'ontology_annotation',
    'addAssay_comments': 'assay',
    'addData_comments': 'data',
    'addProcess_comments': 'process',
    'addOntology_source_reference_comments': 'ontology_source_reference',
    'addPublication_comments': 'publication',
    'addPerson_comments': 'person',
    'addInvestigation_comments': 'investigation',
    'addFactor_comments': 'factor',
    'addStudy_comments': 'study',
    'addProtocol_comments': 'protocol',
    'addProtocol_parameter_comments': 'protocol_parameter',
    'addMaterial_comments': 'material',
    'addSource_comments': 'source',
    'addMaterial_attribute_value_comments': 'material_attribute_value',
    'addFactor_value_comments': 'factor_value',
    'addProcess_parameter_value_comments': 'process_parameter_value',
    'addSample_comments': 'sample',
    'addComponent_comments': 'component'
}



/**
 * comment.prototype.ontology_annotation_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.ontology_annotation_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.ontology_annotation_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneOntology_annotation({
                [models.ontology_annotation.idAttribute()]: this.ontology_annotation_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.ontology_annotation.idAttribute(),
                "value": this.ontology_annotation_comments_fk,
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
 * comment.prototype.assay_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.assay_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.assay_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneAssay({
                [models.assay.idAttribute()]: this.assay_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.assay.idAttribute(),
                "value": this.assay_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.assaysConnection({
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
 * comment.prototype.data_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.data_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.data_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneData({
                [models.data.idAttribute()]: this.data_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.data.idAttribute(),
                "value": this.data_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.dataConnection({
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
 * comment.prototype.process_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.process_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.process_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProcess({
                [models.process.idAttribute()]: this.process_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.process.idAttribute(),
                "value": this.process_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.processesConnection({
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
 * comment.prototype.ontology_source_reference_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.ontology_source_reference_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.ontology_source_reference_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneOntology_source_reference({
                [models.ontology_source_reference.idAttribute()]: this.ontology_source_reference_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.ontology_source_reference.idAttribute(),
                "value": this.ontology_source_reference_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.ontology_source_referencesConnection({
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
 * comment.prototype.publication_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.publication_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.publication_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOnePublication({
                [models.publication.idAttribute()]: this.publication_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.publication.idAttribute(),
                "value": this.publication_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.publicationsConnection({
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
 * comment.prototype.person_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.person_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.person_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOnePerson({
                [models.person.idAttribute()]: this.person_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.person.idAttribute(),
                "value": this.person_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.peopleConnection({
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
 * comment.prototype.investigation_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.investigation_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.investigation_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneInvestigation({
                [models.investigation.idAttribute()]: this.investigation_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.investigation.idAttribute(),
                "value": this.investigation_comments_fk,
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
 * comment.prototype.factor_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.factor_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.factor_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneFactor({
                [models.factor.idAttribute()]: this.factor_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.factor.idAttribute(),
                "value": this.factor_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.factorsConnection({
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
 * comment.prototype.study_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.study_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.study_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneStudy({
                [models.study.idAttribute()]: this.study_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.study.idAttribute(),
                "value": this.study_comments_fk,
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
 * comment.prototype.protocol_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.protocol_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.protocol_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProtocol({
                [models.protocol.idAttribute()]: this.protocol_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.protocol.idAttribute(),
                "value": this.protocol_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.protocolsConnection({
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
 * comment.prototype.protocol_parameter_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.protocol_parameter_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.protocol_parameter_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProtocol_parameter({
                [models.protocol_parameter.idAttribute()]: this.protocol_parameter_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.protocol_parameter.idAttribute(),
                "value": this.protocol_parameter_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.protocol_parametersConnection({
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
 * comment.prototype.material_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.material_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.material_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneMaterial({
                [models.material.idAttribute()]: this.material_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.material.idAttribute(),
                "value": this.material_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.materialsConnection({
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
 * comment.prototype.source_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.source_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.source_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneSource({
                [models.source.idAttribute()]: this.source_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.source.idAttribute(),
                "value": this.source_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.sourcesConnection({
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
 * comment.prototype.material_attribute_value_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.material_attribute_value_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.material_attribute_value_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneMaterial_attribute_value({
                [models.material_attribute_value.idAttribute()]: this.material_attribute_value_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.material_attribute_value.idAttribute(),
                "value": this.material_attribute_value_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.material_attribute_valuesConnection({
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
 * comment.prototype.factor_value_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.factor_value_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.factor_value_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneFactor_value({
                [models.factor_value.idAttribute()]: this.factor_value_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.factor_value.idAttribute(),
                "value": this.factor_value_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.factor_valuesConnection({
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
 * comment.prototype.process_parameter_value_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.process_parameter_value_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.process_parameter_value_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProcess_parameter_value({
                [models.process_parameter_value.idAttribute()]: this.process_parameter_value_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.process_parameter_value.idAttribute(),
                "value": this.process_parameter_value_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.process_parameter_valuesConnection({
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
 * comment.prototype.sample_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.sample_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.sample_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneSample({
                [models.sample.idAttribute()]: this.sample_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.sample.idAttribute(),
                "value": this.sample_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.samplesConnection({
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
 * comment.prototype.component_comments - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
comment.prototype.component_comments = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.component_comments_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneComponent({
                [models.component.idAttribute()]: this.component_comments_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.component.idAttribute(),
                "value": this.component_comments_fk,
                "operator": "eq"
            });
            let found = (await resolvers.componentsConnection({
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
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addOntology_annotation_comments)) {
        promises_add.push(this.add_ontology_annotation_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addAssay_comments)) {
        promises_add.push(this.add_assay_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addData_comments)) {
        promises_add.push(this.add_data_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addProcess_comments)) {
        promises_add.push(this.add_process_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addOntology_source_reference_comments)) {
        promises_add.push(this.add_ontology_source_reference_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addPublication_comments)) {
        promises_add.push(this.add_publication_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addPerson_comments)) {
        promises_add.push(this.add_person_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addInvestigation_comments)) {
        promises_add.push(this.add_investigation_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addFactor_comments)) {
        promises_add.push(this.add_factor_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addStudy_comments)) {
        promises_add.push(this.add_study_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addProtocol_comments)) {
        promises_add.push(this.add_protocol_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addProtocol_parameter_comments)) {
        promises_add.push(this.add_protocol_parameter_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addMaterial_comments)) {
        promises_add.push(this.add_material_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addSource_comments)) {
        promises_add.push(this.add_source_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addMaterial_attribute_value_comments)) {
        promises_add.push(this.add_material_attribute_value_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addFactor_value_comments)) {
        promises_add.push(this.add_factor_value_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addProcess_parameter_value_comments)) {
        promises_add.push(this.add_process_parameter_value_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addSample_comments)) {
        promises_add.push(this.add_sample_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addComponent_comments)) {
        promises_add.push(this.add_component_comments(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeOntology_annotation_comments)) {
        promises_remove.push(this.remove_ontology_annotation_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeAssay_comments)) {
        promises_remove.push(this.remove_assay_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeData_comments)) {
        promises_remove.push(this.remove_data_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeProcess_comments)) {
        promises_remove.push(this.remove_process_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeOntology_source_reference_comments)) {
        promises_remove.push(this.remove_ontology_source_reference_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removePublication_comments)) {
        promises_remove.push(this.remove_publication_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removePerson_comments)) {
        promises_remove.push(this.remove_person_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeInvestigation_comments)) {
        promises_remove.push(this.remove_investigation_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeFactor_comments)) {
        promises_remove.push(this.remove_factor_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeStudy_comments)) {
        promises_remove.push(this.remove_study_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeProtocol_comments)) {
        promises_remove.push(this.remove_protocol_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeProtocol_parameter_comments)) {
        promises_remove.push(this.remove_protocol_parameter_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeMaterial_comments)) {
        promises_remove.push(this.remove_material_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeSource_comments)) {
        promises_remove.push(this.remove_source_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeMaterial_attribute_value_comments)) {
        promises_remove.push(this.remove_material_attribute_value_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeFactor_value_comments)) {
        promises_remove.push(this.remove_factor_value_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeProcess_parameter_value_comments)) {
        promises_remove.push(this.remove_process_parameter_value_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeSample_comments)) {
        promises_remove.push(this.remove_sample_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeComponent_comments)) {
        promises_remove.push(this.remove_component_comments(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_ontology_annotation_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_ontology_annotation_comments = async function(input, benignErrorReporter) {
    await comment.add_ontology_annotation_comments_fk(this.getIdValue(), input.addOntology_annotation_comments, benignErrorReporter);
    this.ontology_annotation_comments_fk = input.addOntology_annotation_comments;
}

/**
 * add_assay_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_assay_comments = async function(input, benignErrorReporter) {
    await comment.add_assay_comments_fk(this.getIdValue(), input.addAssay_comments, benignErrorReporter);
    this.assay_comments_fk = input.addAssay_comments;
}

/**
 * add_data_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_data_comments = async function(input, benignErrorReporter) {
    await comment.add_data_comments_fk(this.getIdValue(), input.addData_comments, benignErrorReporter);
    this.data_comments_fk = input.addData_comments;
}

/**
 * add_process_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_process_comments = async function(input, benignErrorReporter) {
    await comment.add_process_comments_fk(this.getIdValue(), input.addProcess_comments, benignErrorReporter);
    this.process_comments_fk = input.addProcess_comments;
}

/**
 * add_ontology_source_reference_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_ontology_source_reference_comments = async function(input, benignErrorReporter) {
    await comment.add_ontology_source_reference_comments_fk(this.getIdValue(), input.addOntology_source_reference_comments, benignErrorReporter);
    this.ontology_source_reference_comments_fk = input.addOntology_source_reference_comments;
}

/**
 * add_publication_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_publication_comments = async function(input, benignErrorReporter) {
    await comment.add_publication_comments_fk(this.getIdValue(), input.addPublication_comments, benignErrorReporter);
    this.publication_comments_fk = input.addPublication_comments;
}

/**
 * add_person_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_person_comments = async function(input, benignErrorReporter) {
    await comment.add_person_comments_fk(this.getIdValue(), input.addPerson_comments, benignErrorReporter);
    this.person_comments_fk = input.addPerson_comments;
}

/**
 * add_investigation_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_investigation_comments = async function(input, benignErrorReporter) {
    await comment.add_investigation_comments_fk(this.getIdValue(), input.addInvestigation_comments, benignErrorReporter);
    this.investigation_comments_fk = input.addInvestigation_comments;
}

/**
 * add_factor_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_factor_comments = async function(input, benignErrorReporter) {
    await comment.add_factor_comments_fk(this.getIdValue(), input.addFactor_comments, benignErrorReporter);
    this.factor_comments_fk = input.addFactor_comments;
}

/**
 * add_study_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_study_comments = async function(input, benignErrorReporter) {
    await comment.add_study_comments_fk(this.getIdValue(), input.addStudy_comments, benignErrorReporter);
    this.study_comments_fk = input.addStudy_comments;
}

/**
 * add_protocol_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_protocol_comments = async function(input, benignErrorReporter) {
    await comment.add_protocol_comments_fk(this.getIdValue(), input.addProtocol_comments, benignErrorReporter);
    this.protocol_comments_fk = input.addProtocol_comments;
}

/**
 * add_protocol_parameter_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_protocol_parameter_comments = async function(input, benignErrorReporter) {
    await comment.add_protocol_parameter_comments_fk(this.getIdValue(), input.addProtocol_parameter_comments, benignErrorReporter);
    this.protocol_parameter_comments_fk = input.addProtocol_parameter_comments;
}

/**
 * add_material_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_material_comments = async function(input, benignErrorReporter) {
    await comment.add_material_comments_fk(this.getIdValue(), input.addMaterial_comments, benignErrorReporter);
    this.material_comments_fk = input.addMaterial_comments;
}

/**
 * add_source_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_source_comments = async function(input, benignErrorReporter) {
    await comment.add_source_comments_fk(this.getIdValue(), input.addSource_comments, benignErrorReporter);
    this.source_comments_fk = input.addSource_comments;
}

/**
 * add_material_attribute_value_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_material_attribute_value_comments = async function(input, benignErrorReporter) {
    await comment.add_material_attribute_value_comments_fk(this.getIdValue(), input.addMaterial_attribute_value_comments, benignErrorReporter);
    this.material_attribute_value_comments_fk = input.addMaterial_attribute_value_comments;
}

/**
 * add_factor_value_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_factor_value_comments = async function(input, benignErrorReporter) {
    await comment.add_factor_value_comments_fk(this.getIdValue(), input.addFactor_value_comments, benignErrorReporter);
    this.factor_value_comments_fk = input.addFactor_value_comments;
}

/**
 * add_process_parameter_value_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_process_parameter_value_comments = async function(input, benignErrorReporter) {
    await comment.add_process_parameter_value_comments_fk(this.getIdValue(), input.addProcess_parameter_value_comments, benignErrorReporter);
    this.process_parameter_value_comments_fk = input.addProcess_parameter_value_comments;
}

/**
 * add_sample_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_sample_comments = async function(input, benignErrorReporter) {
    await comment.add_sample_comments_fk(this.getIdValue(), input.addSample_comments, benignErrorReporter);
    this.sample_comments_fk = input.addSample_comments;
}

/**
 * add_component_comments - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.add_component_comments = async function(input, benignErrorReporter) {
    await comment.add_component_comments_fk(this.getIdValue(), input.addComponent_comments, benignErrorReporter);
    this.component_comments_fk = input.addComponent_comments;
}

/**
 * remove_ontology_annotation_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_ontology_annotation_comments = async function(input, benignErrorReporter) {
    if (input.removeOntology_annotation_comments == this.ontology_annotation_comments_fk) {
        await comment.remove_ontology_annotation_comments_fk(this.getIdValue(), input.removeOntology_annotation_comments, benignErrorReporter);
        this.ontology_annotation_comments_fk = null;
    }
}

/**
 * remove_assay_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_assay_comments = async function(input, benignErrorReporter) {
    if (input.removeAssay_comments == this.assay_comments_fk) {
        await comment.remove_assay_comments_fk(this.getIdValue(), input.removeAssay_comments, benignErrorReporter);
        this.assay_comments_fk = null;
    }
}

/**
 * remove_data_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_data_comments = async function(input, benignErrorReporter) {
    if (input.removeData_comments == this.data_comments_fk) {
        await comment.remove_data_comments_fk(this.getIdValue(), input.removeData_comments, benignErrorReporter);
        this.data_comments_fk = null;
    }
}

/**
 * remove_process_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_process_comments = async function(input, benignErrorReporter) {
    if (input.removeProcess_comments == this.process_comments_fk) {
        await comment.remove_process_comments_fk(this.getIdValue(), input.removeProcess_comments, benignErrorReporter);
        this.process_comments_fk = null;
    }
}

/**
 * remove_ontology_source_reference_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_ontology_source_reference_comments = async function(input, benignErrorReporter) {
    if (input.removeOntology_source_reference_comments == this.ontology_source_reference_comments_fk) {
        await comment.remove_ontology_source_reference_comments_fk(this.getIdValue(), input.removeOntology_source_reference_comments, benignErrorReporter);
        this.ontology_source_reference_comments_fk = null;
    }
}

/**
 * remove_publication_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_publication_comments = async function(input, benignErrorReporter) {
    if (input.removePublication_comments == this.publication_comments_fk) {
        await comment.remove_publication_comments_fk(this.getIdValue(), input.removePublication_comments, benignErrorReporter);
        this.publication_comments_fk = null;
    }
}

/**
 * remove_person_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_person_comments = async function(input, benignErrorReporter) {
    if (input.removePerson_comments == this.person_comments_fk) {
        await comment.remove_person_comments_fk(this.getIdValue(), input.removePerson_comments, benignErrorReporter);
        this.person_comments_fk = null;
    }
}

/**
 * remove_investigation_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_investigation_comments = async function(input, benignErrorReporter) {
    if (input.removeInvestigation_comments == this.investigation_comments_fk) {
        await comment.remove_investigation_comments_fk(this.getIdValue(), input.removeInvestigation_comments, benignErrorReporter);
        this.investigation_comments_fk = null;
    }
}

/**
 * remove_factor_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_factor_comments = async function(input, benignErrorReporter) {
    if (input.removeFactor_comments == this.factor_comments_fk) {
        await comment.remove_factor_comments_fk(this.getIdValue(), input.removeFactor_comments, benignErrorReporter);
        this.factor_comments_fk = null;
    }
}

/**
 * remove_study_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_study_comments = async function(input, benignErrorReporter) {
    if (input.removeStudy_comments == this.study_comments_fk) {
        await comment.remove_study_comments_fk(this.getIdValue(), input.removeStudy_comments, benignErrorReporter);
        this.study_comments_fk = null;
    }
}

/**
 * remove_protocol_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_protocol_comments = async function(input, benignErrorReporter) {
    if (input.removeProtocol_comments == this.protocol_comments_fk) {
        await comment.remove_protocol_comments_fk(this.getIdValue(), input.removeProtocol_comments, benignErrorReporter);
        this.protocol_comments_fk = null;
    }
}

/**
 * remove_protocol_parameter_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_protocol_parameter_comments = async function(input, benignErrorReporter) {
    if (input.removeProtocol_parameter_comments == this.protocol_parameter_comments_fk) {
        await comment.remove_protocol_parameter_comments_fk(this.getIdValue(), input.removeProtocol_parameter_comments, benignErrorReporter);
        this.protocol_parameter_comments_fk = null;
    }
}

/**
 * remove_material_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_material_comments = async function(input, benignErrorReporter) {
    if (input.removeMaterial_comments == this.material_comments_fk) {
        await comment.remove_material_comments_fk(this.getIdValue(), input.removeMaterial_comments, benignErrorReporter);
        this.material_comments_fk = null;
    }
}

/**
 * remove_source_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_source_comments = async function(input, benignErrorReporter) {
    if (input.removeSource_comments == this.source_comments_fk) {
        await comment.remove_source_comments_fk(this.getIdValue(), input.removeSource_comments, benignErrorReporter);
        this.source_comments_fk = null;
    }
}

/**
 * remove_material_attribute_value_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_material_attribute_value_comments = async function(input, benignErrorReporter) {
    if (input.removeMaterial_attribute_value_comments == this.material_attribute_value_comments_fk) {
        await comment.remove_material_attribute_value_comments_fk(this.getIdValue(), input.removeMaterial_attribute_value_comments, benignErrorReporter);
        this.material_attribute_value_comments_fk = null;
    }
}

/**
 * remove_factor_value_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_factor_value_comments = async function(input, benignErrorReporter) {
    if (input.removeFactor_value_comments == this.factor_value_comments_fk) {
        await comment.remove_factor_value_comments_fk(this.getIdValue(), input.removeFactor_value_comments, benignErrorReporter);
        this.factor_value_comments_fk = null;
    }
}

/**
 * remove_process_parameter_value_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_process_parameter_value_comments = async function(input, benignErrorReporter) {
    if (input.removeProcess_parameter_value_comments == this.process_parameter_value_comments_fk) {
        await comment.remove_process_parameter_value_comments_fk(this.getIdValue(), input.removeProcess_parameter_value_comments, benignErrorReporter);
        this.process_parameter_value_comments_fk = null;
    }
}

/**
 * remove_sample_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_sample_comments = async function(input, benignErrorReporter) {
    if (input.removeSample_comments == this.sample_comments_fk) {
        await comment.remove_sample_comments_fk(this.getIdValue(), input.removeSample_comments, benignErrorReporter);
        this.sample_comments_fk = null;
    }
}

/**
 * remove_component_comments - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
comment.prototype.remove_component_comments = async function(input, benignErrorReporter) {
    if (input.removeComponent_comments == this.component_comments_fk) {
        await comment.remove_component_comments_fk(this.getIdValue(), input.removeComponent_comments, benignErrorReporter);
        this.component_comments_fk = null;
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

    let comment = await resolvers.readOneComment({
        id: id
    }, context);
    //check that record actually exists
    if (comment === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    promises_to_one.push(comment.ontology_annotation_comments({}, context));
    promises_to_one.push(comment.assay_comments({}, context));
    promises_to_one.push(comment.data_comments({}, context));
    promises_to_one.push(comment.process_comments({}, context));
    promises_to_one.push(comment.ontology_source_reference_comments({}, context));
    promises_to_one.push(comment.publication_comments({}, context));
    promises_to_one.push(comment.person_comments({}, context));
    promises_to_one.push(comment.investigation_comments({}, context));
    promises_to_one.push(comment.factor_comments({}, context));
    promises_to_one.push(comment.study_comments({}, context));
    promises_to_one.push(comment.protocol_comments({}, context));
    promises_to_one.push(comment.protocol_parameter_comments({}, context));
    promises_to_one.push(comment.material_comments({}, context));
    promises_to_one.push(comment.source_comments({}, context));
    promises_to_one.push(comment.material_attribute_value_comments({}, context));
    promises_to_one.push(comment.factor_value_comments({}, context));
    promises_to_one.push(comment.process_parameter_value_comments({}, context));
    promises_to_one.push(comment.sample_comments({}, context));
    promises_to_one.push(comment.component_comments({}, context));


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
        throw new Error(`comment with id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
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
    const comment_record = await resolvers.readOneComment({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * comments - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    comments: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'comment', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "comments");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await comment.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * commentsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    commentsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'comment', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "commentsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await comment.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneComment - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneComment: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'comment', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneComment");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await comment.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countComments - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countComments: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'comment', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await comment.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateCommentForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCommentForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'comment', 'read');
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
                    comment,
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
     * validateCommentForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCommentForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'comment', 'read');
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
                    comment,
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
     * validateCommentForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCommentForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'comment', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    comment,
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
     * validateCommentAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCommentAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'comment', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    comment,
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
     * addComment - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addComment: async function(input, context) {
        let authorization = await checkAuthorization(context, 'comment', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdComment = await comment.addOne(inputSanitized, benignErrorReporter);
            await createdComment.handleAssociations(inputSanitized, benignErrorReporter);
            return createdComment;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddCommentCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddCommentCsv: async function(_, context) {
        if (await checkAuthorization(context, 'comment', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return comment.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteComment - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteComment: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'comment', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return comment.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateComment - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateComment: async function(input, context) {
        let authorization = await checkAuthorization(context, 'comment', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedComment = await comment.updateOne(inputSanitized, benignErrorReporter);
            await updatedComment.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedComment;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateCommentWithOntology_annotation_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithOntology_annotation_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                ontology_annotation_comments_fk
            }) => ontology_annotation_comments_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithOntology_annotation_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithAssay_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithAssay_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_comments_fk
            }) => assay_comments_fk)), models.assay);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithAssay_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithData_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithData_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                data_comments_fk
            }) => data_comments_fk)), models.data);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithData_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithProcess_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithProcess_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                process_comments_fk
            }) => process_comments_fk)), models.process);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithProcess_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithOntology_source_reference_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithOntology_source_reference_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                ontology_source_reference_comments_fk
            }) => ontology_source_reference_comments_fk)), models.ontology_source_reference);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithOntology_source_reference_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithPublication_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithPublication_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                publication_comments_fk
            }) => publication_comments_fk)), models.publication);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithPublication_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithPerson_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithPerson_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                person_comments_fk
            }) => person_comments_fk)), models.person);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithPerson_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithInvestigation_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithInvestigation_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                investigation_comments_fk
            }) => investigation_comments_fk)), models.investigation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithInvestigation_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithFactor_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithFactor_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                factor_comments_fk
            }) => factor_comments_fk)), models.factor);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithFactor_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithStudy_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithStudy_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_comments_fk
            }) => study_comments_fk)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithStudy_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithProtocol_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithProtocol_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                protocol_comments_fk
            }) => protocol_comments_fk)), models.protocol);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithProtocol_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithProtocol_parameter_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithProtocol_parameter_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                protocol_parameter_comments_fk
            }) => protocol_parameter_comments_fk)), models.protocol_parameter);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithProtocol_parameter_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithMaterial_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithMaterial_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                material_comments_fk
            }) => material_comments_fk)), models.material);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithMaterial_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithSource_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithSource_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                source_comments_fk
            }) => source_comments_fk)), models.source);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithSource_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithMaterial_attribute_value_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithMaterial_attribute_value_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                material_attribute_value_comments_fk
            }) => material_attribute_value_comments_fk)), models.material_attribute_value);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithMaterial_attribute_value_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithFactor_value_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithFactor_value_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                factor_value_comments_fk
            }) => factor_value_comments_fk)), models.factor_value);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithFactor_value_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithProcess_parameter_value_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithProcess_parameter_value_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                process_parameter_value_comments_fk
            }) => process_parameter_value_comments_fk)), models.process_parameter_value);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithProcess_parameter_value_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithSample_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithSample_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                sample_comments_fk
            }) => sample_comments_fk)), models.sample);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithSample_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCommentWithComponent_comments_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCommentWithComponent_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                component_comments_fk
            }) => component_comments_fk)), models.component);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkAssociateCommentWithComponent_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithOntology_annotation_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithOntology_annotation_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                ontology_annotation_comments_fk
            }) => ontology_annotation_comments_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithOntology_annotation_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithAssay_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithAssay_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_comments_fk
            }) => assay_comments_fk)), models.assay);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithAssay_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithData_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithData_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                data_comments_fk
            }) => data_comments_fk)), models.data);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithData_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithProcess_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithProcess_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                process_comments_fk
            }) => process_comments_fk)), models.process);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithProcess_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithOntology_source_reference_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithOntology_source_reference_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                ontology_source_reference_comments_fk
            }) => ontology_source_reference_comments_fk)), models.ontology_source_reference);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithOntology_source_reference_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithPublication_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithPublication_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                publication_comments_fk
            }) => publication_comments_fk)), models.publication);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithPublication_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithPerson_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithPerson_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                person_comments_fk
            }) => person_comments_fk)), models.person);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithPerson_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithInvestigation_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithInvestigation_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                investigation_comments_fk
            }) => investigation_comments_fk)), models.investigation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithInvestigation_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithFactor_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithFactor_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                factor_comments_fk
            }) => factor_comments_fk)), models.factor);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithFactor_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithStudy_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithStudy_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_comments_fk
            }) => study_comments_fk)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithStudy_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithProtocol_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithProtocol_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                protocol_comments_fk
            }) => protocol_comments_fk)), models.protocol);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithProtocol_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithProtocol_parameter_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithProtocol_parameter_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                protocol_parameter_comments_fk
            }) => protocol_parameter_comments_fk)), models.protocol_parameter);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithProtocol_parameter_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithMaterial_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithMaterial_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                material_comments_fk
            }) => material_comments_fk)), models.material);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithMaterial_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithSource_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithSource_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                source_comments_fk
            }) => source_comments_fk)), models.source);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithSource_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithMaterial_attribute_value_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithMaterial_attribute_value_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                material_attribute_value_comments_fk
            }) => material_attribute_value_comments_fk)), models.material_attribute_value);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithMaterial_attribute_value_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithFactor_value_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithFactor_value_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                factor_value_comments_fk
            }) => factor_value_comments_fk)), models.factor_value);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithFactor_value_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithProcess_parameter_value_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithProcess_parameter_value_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                process_parameter_value_comments_fk
            }) => process_parameter_value_comments_fk)), models.process_parameter_value);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithProcess_parameter_value_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithSample_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithSample_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                sample_comments_fk
            }) => sample_comments_fk)), models.sample);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithSample_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCommentWithComponent_comments_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCommentWithComponent_comments_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                component_comments_fk
            }) => component_comments_fk)), models.component);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), comment);
        }
        return await comment.bulkDisAssociateCommentWithComponent_comments_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateComment - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateComment: async function(_, context) {
        if (await checkAuthorization(context, 'comment', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return comment.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}