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
        /**
         * Adapter: author_server1
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'author_server1',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'author_server1',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'author_server1',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'author_server1',
                permissions: 'delete'
            }]
        },
        /**
         * Adapter: author_server2
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'author_server2',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'author_server2',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'author_server2',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'author_server2',
                permissions: 'delete'
            }]
        },
        /**
         * Adapter: book_server1
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'book_server1',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'book_server1',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'book_server1',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'book_server1',
                permissions: 'delete'
            }]
        },
        /**
         * Adapter: book_server2
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'book_server2',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'book_server2',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'book_server2',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'book_server2',
                permissions: 'delete'
            }]
        },
    ]
}