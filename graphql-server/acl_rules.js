module.exports = {
    aclRules: [
        //administrator role permission
        {
            roles: 'administrator',
            allows: [{
                resources: [
                    'role',
                    'user',
                    'role_to_user',
                ],
                permissions: '*'
            }]
        },

        // model and adapter permissions
        {
            roles: 'editor',
            allows: [{
                resources: [
                    'assay',
                    'comment',
                    'component',
                    'data',
                    'factor',
                    'factor_value',
                    'investigation',
                    'material',
                    'material_attribute',
                    'material_attribute_value',
                    'ontology_annotation',
                    'ontology_source_reference',
                    'organization',
                    'person',
                    'process',
                    'process_parameter_value',
                    'protocol',
                    'protocol_parameter',
                    'publication',
                    'sample',
                    'source',
                    'study',
                ],
                permissions: ['create', 'update', 'delete', 'search']
            }]
        },

        {
            roles: 'reader',
            allows: [{
                resources: [
                    'assay',
                    'comment',
                    'component',
                    'data',
                    'factor',
                    'factor_value',
                    'investigation',
                    'material',
                    'material_attribute',
                    'material_attribute_value',
                    'ontology_annotation',
                    'ontology_source_reference',
                    'organization',
                    'person',
                    'process',
                    'process_parameter_value',
                    'protocol',
                    'protocol_parameter',
                    'publication',
                    'sample',
                    'source',
                    'study',
                ],
                permissions: ['read']
            }]
        },
    ]
}