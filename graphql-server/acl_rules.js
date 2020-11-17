module.exports = {
    aclRules: [
        //administrator
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

        //models
        /**
         * Model: breedingMethod
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'breedingMethod',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'breedingMethod',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'breedingMethod',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'breedingMethod',
                permissions: 'delete'
            }]
        },
        /**
         * Model: contact
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'contact',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'contact',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'contact',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'contact',
                permissions: 'delete'
            }]
        },
        /**
         * Model: environmentParameter
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'environmentParameter',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'environmentParameter',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'environmentParameter',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'environmentParameter',
                permissions: 'delete'
            }]
        },
        /**
         * Model: event
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'event',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'event',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'event',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'event',
                permissions: 'delete'
            }]
        },
        /**
         * Model: eventParameter
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'eventParameter',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'eventParameter',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'eventParameter',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'eventParameter',
                permissions: 'delete'
            }]
        },
        /**
         * Model: germplasm
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'germplasm',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'germplasm',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'germplasm',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'germplasm',
                permissions: 'delete'
            }]
        },
        /**
         * Model: image
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'image',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'image',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'image',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'image',
                permissions: 'delete'
            }]
        },
        /**
         * Model: location
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'location',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'location',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'location',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'location',
                permissions: 'delete'
            }]
        },
        /**
         * Model: method
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'method',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'method',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'method',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'method',
                permissions: 'delete'
            }]
        },
        /**
         * Model: observation
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'observation',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'observation',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'observation',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'observation',
                permissions: 'delete'
            }]
        },
        /**
         * Model: observationTreatment
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'observationTreatment',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'observationTreatment',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'observationTreatment',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'observationTreatment',
                permissions: 'delete'
            }]
        },
        /**
         * Model: observationUnit
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'observationUnit',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'observationUnit',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'observationUnit',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'observationUnit',
                permissions: 'delete'
            }]
        },
        /**
         * Model: observationUnitPosition
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'observationUnitPosition',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'observationUnitPosition',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'observationUnitPosition',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'observationUnitPosition',
                permissions: 'delete'
            }]
        },
        /**
         * Model: observationVariable
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'observationVariable',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'observationVariable',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'observationVariable',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'observationVariable',
                permissions: 'delete'
            }]
        },
        /**
         * Model: ontologyReference
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'ontologyReference',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'ontologyReference',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'ontologyReference',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'ontologyReference',
                permissions: 'delete'
            }]
        },
        /**
         * Model: program
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'program',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'program',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'program',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'program',
                permissions: 'delete'
            }]
        },
        /**
         * Model: scale
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'scale',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'scale',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'scale',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'scale',
                permissions: 'delete'
            }]
        },
        /**
         * Model: season
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'season',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'season',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'season',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'season',
                permissions: 'delete'
            }]
        },
        /**
         * Model: study
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'study',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'study',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'study',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'study',
                permissions: 'delete'
            }]
        },
        /**
         * Model: trait
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'trait',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'trait',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'trait',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'trait',
                permissions: 'delete'
            }]
        },
        /**
         * Model: trial
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'trial',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'trial',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'trial',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'trial',
                permissions: 'delete'
            }]
        },

        //adapters
    ]
}