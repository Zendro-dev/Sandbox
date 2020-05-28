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
          'accession',
          'individual',
          'location',
          'measurement',
          'taxon',
        ],
        permissions: '*'
      }]
    },

    //models
    {
      /**
       * Model: accession
       */
      roles: 'accession_create',
      allows: [{
        resources: 'accession',
        permissions: 'create'
      }]
    },
    {
      roles: 'accession_read',
      allows: [{
        resources: 'accession',
        permissions: 'read'
      }]
    },
    {
      roles: 'accession_update',
      allows: [{
        resources: 'accession',
        permissions: 'update'
      }]
    },
    {
      roles: 'accession_delete',
      allows: [{
        resources: 'accession',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: individual
       */
      roles: 'individual_create',
      allows: [{
        resources: 'individual',
        permissions: 'create'
      }]
    },
    {
      roles: 'individual_read',
      allows: [{
        resources: 'individual',
        permissions: 'read'
      }]
    },
    {
      roles: 'individual_update',
      allows: [{
        resources: 'individual',
        permissions: 'update'
      }]
    },
    {
      roles: 'individual_delete',
      allows: [{
        resources: 'individual',
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
       * Model: measurement
       */
      roles: 'measurement_create',
      allows: [{
        resources: 'measurement',
        permissions: 'create'
      }]
    },
    {
      roles: 'measurement_read',
      allows: [{
        resources: 'measurement',
        permissions: 'read'
      }]
    },
    {
      roles: 'measurement_update',
      allows: [{
        resources: 'measurement',
        permissions: 'update'
      }]
    },
    {
      roles: 'measurement_delete',
      allows: [{
        resources: 'measurement',
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