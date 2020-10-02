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
         * Model: mariadb_author
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'mariadb_author',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'mariadb_author',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'mariadb_author',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'mariadb_author',
                permissions: 'delete'
            }]
        },
        /**
         * Model: mysql_author
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'mysql_author',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'mysql_author',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'mysql_author',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'mysql_author',
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
         * Model: mariadb_book
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'mariadb_book',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'mariadb_book',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'mariadb_book',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'mariadb_book',
                permissions: 'delete'
            }]
        },
        /**
         * Model: mysql_book
         */
        {
            roles: 'editor',
            allows: [{
                resources: 'mysql_book',
                permissions: 'create'
            }]
        },
        {
            roles: 'reader',
            allows: [{
                resources: 'mysql_book',
                permissions: 'read'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'mysql_book',
                permissions: 'update'
            }]
        },
        {
            roles: 'editor',
            allows: [{
                resources: 'mysql_book',
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
    ]
}