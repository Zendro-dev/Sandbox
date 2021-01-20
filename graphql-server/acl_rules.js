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
         * Model: author
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'author',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'author',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'author',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'author',
                permissions: 'delete'
            }]
        },
        /**
         * Model: book
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'book',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'book',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'book',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'book',
                permissions: 'delete'
            }]
        },
        /**
         * Model: SPARefactor
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'SPARefactor',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'SPARefactor',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'SPARefactor',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'SPARefactor',
                permissions: 'delete'
            }]
        },

        //adapters
    ]
}