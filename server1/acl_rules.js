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

        //adapters
    ]
}