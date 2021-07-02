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
                    'author',
                    'book',
                    'capital',
                    'country',
                    'publisher',
                    'author_instance1',
                    'author_instance2',
                    'book_instance1',
                    'book_instance2',
                    'capital_instance1',
                    'capital_instance2',
                    'country_instance1',
                    'country_instance2',
                    'publisher_instance1',
                    'publisher_instance2',
                ],
                permissions: ['create', 'update', 'delete', 'search']
            }]
        },

        {
            roles: 'reader',
            allows: [{
                resources: [
                    'author',
                    'book',
                    'capital',
                    'country',
                    'publisher',
                    'author_instance1',
                    'author_instance2',
                    'book_instance1',
                    'book_instance2',
                    'capital_instance1',
                    'capital_instance2',
                    'country_instance1',
                    'country_instance2',
                    'publisher_instance1',
                    'publisher_instance2',
                ],
                permissions: ['read']
            }]
        },
    ]
}