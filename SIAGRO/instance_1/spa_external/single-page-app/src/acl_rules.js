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
     * Model: caracteristica_cualitativa
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'caracteristica_cualitativa',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'caracteristica_cualitativa',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'caracteristica_cualitativa',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'caracteristica_cualitativa',
        permissions: 'delete'
      }]
    },
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
     * Model: ejemplar
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'ejemplar',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'ejemplar',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'ejemplar',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'ejemplar',
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