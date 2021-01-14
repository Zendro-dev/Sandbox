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