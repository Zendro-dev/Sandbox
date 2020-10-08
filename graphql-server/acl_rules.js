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
         * Model: ImageAttachment
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'ImageAttachment',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'ImageAttachment',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'ImageAttachment',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'ImageAttachment',
                permissions: 'delete'
            }]
        },
        /**
         * Model: Person
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'Person',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'Person',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Person',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'Person',
                permissions: 'delete'
            }]
        },

        //adapters
    ]
}