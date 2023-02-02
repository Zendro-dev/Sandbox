module.exports = {
    aclRules: [
        // model and adapter permissions
        {
            roles: 'editor',
            allows: [{
                resources: [
                    'event',
                    'observation',
                    'observationUnit',
                    'observationUnitPosition',
                ],
                permissions: ['create', 'update', 'delete', 'search']
            }]
        },

        {
            roles: 'reader',
            allows: [{
                resources: [
                    'event',
                    'observation',
                    'observationUnit',
                    'observationUnitPosition',
                ],
                permissions: ['read']
            }]
        },
    ]
}