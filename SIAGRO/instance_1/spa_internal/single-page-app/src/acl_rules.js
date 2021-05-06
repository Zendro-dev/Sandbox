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
     * Model: cuadrante
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'cuadrante',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'cuadrante',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'cuadrante',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'cuadrante',
        permissions: 'delete'
      }]
    },
    /**
     * Model: grupo_enfoque
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'grupo_enfoque',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'grupo_enfoque',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'grupo_enfoque',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'grupo_enfoque',
        permissions: 'delete'
      }]
    },
    /**
     * Model: sitio
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'sitio',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'sitio',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'sitio',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'sitio',
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
    /**
     * Model: tipo_planta
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'tipo_planta',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'tipo_planta',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'tipo_planta',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'tipo_planta',
        permissions: 'delete'
      }]
    },
  ]
}