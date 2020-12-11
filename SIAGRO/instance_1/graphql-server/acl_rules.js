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
         * Model: caracteristica_cualitativa
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'caracteristica_cualitativa',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'caracteristica_cualitativa',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'caracteristica_cualitativa',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'caracteristica_cualitativa',
                permissions: 'delete'
            }]
        },
        /**
         * Model: caracteristica_cuantitativa
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'caracteristica_cuantitativa',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'caracteristica_cuantitativa',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'caracteristica_cuantitativa',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'caracteristica_cuantitativa',
                permissions: 'delete'
            }]
        },
        /**
         * Model: Ejemplar
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'Ejemplar',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'Ejemplar',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Ejemplar',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Ejemplar',
                permissions: 'delete'
            }]
        },
        /**
         * Model: metodo
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'metodo',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'metodo',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'metodo',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'metodo',
                permissions: 'delete'
            }]
        },
        /**
         * Model: Taxon
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'Taxon',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'Taxon',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Taxon',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Taxon',
                permissions: 'delete'
            }]
        },

        //adapters
    ]
}