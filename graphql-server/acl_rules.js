module.exports = {
    aclRules: [
        // model and adapter permissions
        {
            roles: 'editor',
            allows: [{
                resources: [
                    'breedingMethod',
                    'event',
                    'germplasm',
                    'location',
                    'observation',
                    'observationTreatment',
                    'observationUnit',
                    'observationUnitPosition',
                    'study',
                    'trial',
                ],
                permissions: ['create', 'update', 'delete', 'search']
            }]
        },

        {
            roles: 'reader',
            allows: [{
                resources: [
                    'breedingMethod',
                    'event',
                    'germplasm',
                    'location',
                    'observation',
                    'observationTreatment',
                    'observationUnit',
                    'observationUnitPosition',
                    'study',
                    'trial',
                ],
                permissions: ['read']
            }]
        },
    ]
}