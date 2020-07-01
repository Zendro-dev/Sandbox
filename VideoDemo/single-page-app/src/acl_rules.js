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
          'plant_variant',
          'tomato_Measurement',
        ],
        permissions: '*'
      }]
    },

    //models
    {
      /**
       * Model: plant_variant
       */
      roles: 'plant_variant_create',
      allows: [{
        resources: 'plant_variant',
        permissions: 'create'
      }]
    },
    {
      roles: 'plant_variant_read',
      allows: [{
        resources: 'plant_variant',
        permissions: 'read'
      }]
    },
    {
      roles: 'plant_variant_update',
      allows: [{
        resources: 'plant_variant',
        permissions: 'update'
      }]
    },
    {
      roles: 'plant_variant_delete',
      allows: [{
        resources: 'plant_variant',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: tomato_Measurement
       */
      roles: 'tomato_Measurement_create',
      allows: [{
        resources: 'tomato_Measurement',
        permissions: 'create'
      }]
    },
    {
      roles: 'tomato_Measurement_read',
      allows: [{
        resources: 'tomato_Measurement',
        permissions: 'read'
      }]
    },
    {
      roles: 'tomato_Measurement_update',
      allows: [{
        resources: 'tomato_Measurement',
        permissions: 'update'
      }]
    },
    {
      roles: 'tomato_Measurement_delete',
      allows: [{
        resources: 'tomato_Measurement',
        permissions: 'delete'
      }]
    },
  ]
}