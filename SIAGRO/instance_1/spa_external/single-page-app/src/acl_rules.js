module.exports = {
  aclRules: [
    //administrator
    {
      roles: 'administrator',
      allows: [{
        resources: [
          'role',
          'role_to_user',
          'user',
        ],
        permissions: '*'
      }]
    },

    //models
    /**
     * Model: caracteristica_cuantitativa
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'caracteristica_cuantitativa',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'caracteristica_cuantitativa',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'caracteristica_cuantitativa',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'caracteristica_cuantitativa',
        permissions: 'delete'
      }]
    },
    /**
     * Model: metodo
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'metodo',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'metodo',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'metodo',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'metodo',
        permissions: 'delete'
      }]
    },
    /**
     * Model: referencia
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'referencia',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'referencia',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'referencia',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'referencia',
        permissions: 'delete'
      }]
    },
    /**
     * Model: registro
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'registro',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'registro',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'registro',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'registro',
        permissions: 'delete'
      }]
    },
    /**
     * Model: taxon
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'taxon',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'taxon',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'taxon',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'taxon',
        permissions: 'delete'
      }]
    },
  ]
}