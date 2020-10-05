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
         * Model: post_author
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'post_author',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'post_author',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'post_author',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'post_author',
                permissions: 'delete'
            }]
        },
        /**
         * Model: sq_author
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_author',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'sq_author',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_author',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_author',
                permissions: 'delete'
            }]
        },
        /**
         * Model: sq_author
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_author',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'sq_author',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_author',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_author',
                permissions: 'delete'
            }]
        },
        /**
         * Model: sq_author
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_author',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'sq_author',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_author',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_author',
                permissions: 'delete'
            }]
        },
        /**
         * Model: post_book
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'post_book',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'post_book',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'post_book',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'post_book',
                permissions: 'delete'
            }]
        },
        /**
         * Model: sq_book
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_book',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'sq_book',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_book',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_book',
                permissions: 'delete'
            }]
        },
        /**
         * Model: sq_book
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_book',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'sq_book',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_book',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_book',
                permissions: 'delete'
            }]
        },
        /**
         * Model: sq_book
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_book',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'sq_book',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_book',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'sq_book',
                permissions: 'delete'
            }]
        },

        //adapters
        /**
         * Adapter: author_local
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'author_local',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'author_local',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'author_local',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'author_local',
                permissions: 'delete'
            }]
        },
        /**
         * Adapter: author_remote
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'author_remote',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'author_remote',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'author_remote',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'author_remote',
                permissions: 'delete'
            }]
        },
        /**
         * Adapter: book_local
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'book_local',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'book_local',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'book_local',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'book_local',
                permissions: 'delete'
            }]
        },
        /**
         * Adapter: book_remote
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'book_remote',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'book_remote',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'book_remote',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'book_remote',
                permissions: 'delete'
            }]
        },
    ]
}