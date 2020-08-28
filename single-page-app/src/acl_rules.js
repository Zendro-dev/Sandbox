module.exports = {
  aclRules: [
    //all models
    {
      roles: 'administrator',
      allows: [{
        resources: [
          'role',
          'role_to_user',
          'user',
          'fileAttachment',
        ],
        permissions: '*'
      }]
    },

    //models
    {
      /**
       * Model: fileAttachment
       */
      roles: 'fileAttachment_create',
      allows: [{
        resources: 'fileAttachment',
        permissions: 'create'
      }]
    },
    {
      roles: 'fileAttachment_read',
      allows: [{
        resources: 'fileAttachment',
        permissions: 'read'
      }]
    },
    {
      roles: 'fileAttachment_update',
      allows: [{
        resources: 'fileAttachment',
        permissions: 'update'
      }]
    },
    {
      roles: 'fileAttachment_delete',
      allows: [{
        resources: 'fileAttachment',
        permissions: 'delete'
      }]
    },
  ]
}
