module.exports = {
  aclRules: [
    //all models
    {
      roles: 'admin',
      allows: [{
        resources: [
          'role',
          'role_to_user',
          'user',
          'cuadrante',
          'grupo_enfoque',
          'location',
          'taxon',
        ],
        permissions: '*'
      }]
    },

    //models
    {
      /**
       * Model: cuadrante
       */
      roles: 'cuadrante_create',
      allows: [{
        resources: 'cuadrante',
        permissions: 'create'
      }]
    },
    {
      roles: 'cuadrante_read',
      allows: [{
        resources: 'cuadrante',
        permissions: 'read'
      }]
    },
    {
      roles: 'cuadrante_update',
      allows: [{
        resources: 'cuadrante',
        permissions: 'update'
      }]
    },
    {
      roles: 'cuadrante_delete',
      allows: [{
        resources: 'cuadrante',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: grupo_enfoque
       */
      roles: 'grupo_enfoque_create',
      allows: [{
        resources: 'grupo_enfoque',
        permissions: 'create'
      }]
    },
    {
      roles: 'grupo_enfoque_read',
      allows: [{
        resources: 'grupo_enfoque',
        permissions: 'read'
      }]
    },
    {
      roles: 'grupo_enfoque_update',
      allows: [{
        resources: 'grupo_enfoque',
        permissions: 'update'
      }]
    },
    {
      roles: 'grupo_enfoque_delete',
      allows: [{
        resources: 'grupo_enfoque',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: location
       */
      roles: 'location_create',
      allows: [{
        resources: 'location',
        permissions: 'create'
      }]
    },
    {
      roles: 'location_read',
      allows: [{
        resources: 'location',
        permissions: 'read'
      }]
    },
    {
      roles: 'location_update',
      allows: [{
        resources: 'location',
        permissions: 'update'
      }]
    },
    {
      roles: 'location_delete',
      allows: [{
        resources: 'location',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: taxon
       */
      roles: 'taxon_create',
      allows: [{
        resources: 'taxon',
        permissions: 'create'
      }]
    },
    {
      roles: 'taxon_read',
      allows: [{
        resources: 'taxon',
        permissions: 'read'
      }]
    },
    {
      roles: 'taxon_update',
      allows: [{
        resources: 'taxon',
        permissions: 'update'
      }]
    },
    {
      roles: 'taxon_delete',
      allows: [{
        resources: 'taxon',
        permissions: 'delete'
      }]
    },
  ]
}