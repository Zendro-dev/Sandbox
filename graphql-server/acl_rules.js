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
                    'determinacion',
                    'donante',
                    'manejo',
                    'proyecto',
                    'registro_siagro',
                    'registro_snib',
                    'sitio',
                    'taxon',
                ],
                permissions: ['create', 'update', 'delete', 'search']
            }]
        },

        {
            roles: 'reader',
            allows: [{
                resources: [
                    'determinacion',
                    'donante',
                    'manejo',
                    'proyecto',
                    'registro_siagro',
                    'registro_snib',
                    'sitio',
                    'taxon',
                ],
                permissions: ['read']
            }]
        },
    ]
}