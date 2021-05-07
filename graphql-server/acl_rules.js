module.exports = {
    aclRules: [
        //administrator role permission
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

        // model and adapter permissions
        {
            roles: 'editor',
            allows: [{
                resources: [
                    'alien',
                    'capital',
                    'continent',
                    'country',
                    'river',
                ],
                permissions: ['create', 'update', 'delete', 'search']
            }]
        },

        {
            roles: 'reader',
            allows: [{
                resources: [
                    'alien',
                    'capital',
                    'continent',
                    'country',
                    'river',
                ],
                permissions: ['read']
            }]
        },

        {
            roles: 'reader',
            allows: [{
                resources: ['meta_query'],
                permissions: ['execute']
            }]
        }
    ]
}