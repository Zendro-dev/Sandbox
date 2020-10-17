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
         * Model: Accession
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'Accession',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'Accession',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Accession',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Accession',
                permissions: 'delete'
            }]
        },
        /**
         * Model: capital
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'capital',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'capital',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'capital',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'capital',
                permissions: 'delete'
            }]
        },
        /**
         * Model: country
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'country',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'country',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'country',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'country',
                permissions: 'delete'
            }]
        },
        /**
         * Model: country_to_river
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'country_to_river',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'country_to_river',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'country_to_river',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'country_to_river',
                permissions: 'delete'
            }]
        },
        /**
         * Model: cultivar
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'cultivar',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'cultivar',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'cultivar',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'cultivar',
                permissions: 'delete'
            }]
        },
        /**
         * Model: field_plot
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'field_plot',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'field_plot',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'field_plot',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'field_plot',
                permissions: 'delete'
            }]
        },
        /**
         * Model: individual
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'individual',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'individual',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'individual',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'individual',
                permissions: 'delete'
            }]
        },
        /**
         * Model: Location
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'Location',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'Location',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Location',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Location',
                permissions: 'delete'
            }]
        },
        /**
         * Model: Measurement
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'Measurement',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'Measurement',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Measurement',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Measurement',
                permissions: 'delete'
            }]
        },
        /**
         * Model: microbiome_asv
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'microbiome_asv',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'microbiome_asv',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'microbiome_asv',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'microbiome_asv',
                permissions: 'delete'
            }]
        },
        /**
         * Model: plant_measurement
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'plant_measurement',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'plant_measurement',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'plant_measurement',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'plant_measurement',
                permissions: 'delete'
            }]
        },
        /**
         * Model: pot
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'pot',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'pot',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'pot',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'pot',
                permissions: 'delete'
            }]
        },
        /**
         * Model: river
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'river',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'river',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'river',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'river',
                permissions: 'delete'
            }]
        },
        /**
         * Model: sample
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'sample',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'sample',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sample',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sample',
                permissions: 'delete'
            }]
        },
        /**
         * Model: sample_measurement
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'sample_measurement',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'sample_measurement',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sample_measurement',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sample_measurement',
                permissions: 'delete'
            }]
        },
        /**
         * Model: taxon
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'taxon',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'taxon',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'taxon',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'taxon',
                permissions: 'delete'
            }]
        },
        /**
         * Model: transcript_count
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'transcript_count',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'transcript_count',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'transcript_count',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'transcript_count',
                permissions: 'delete'
            }]
        },

        //adapters
    ]
}