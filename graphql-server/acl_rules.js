module.exports = {
    aclRules: [
        // model and adapter permissions
        {
            roles: 'editor',
            allows: [{
                resources: [
                    'biological_material',
                    'data_file',
                    'environment',
                    'event',
                    'factor',
                    'investigation',
                    'observation_unit',
                    'observed_variable',
                    'person',
                    'sample',
                    'study',
                ],
                permissions: ['create', 'update', 'delete', 'search']
            }]
        },

        {
            roles: 'reader',
            allows: [{
                resources: [
                    'biological_material',
                    'data_file',
                    'environment',
                    'event',
                    'factor',
                    'investigation',
                    'observation_unit',
                    'observed_variable',
                    'person',
                    'sample',
                    'study',
                ],
                permissions: ['read']
            }]
        },
    ]
}