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
     * Model: sPARefactor
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'sPARefactor',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'sPARefactor',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'sPARefactor',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'sPARefactor',
        permissions: 'delete'
      }]
    },
  ]
}