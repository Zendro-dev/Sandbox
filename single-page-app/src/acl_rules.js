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
     * Model: author
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'author',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'author',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'author',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'author',
        permissions: 'delete'
      }]
    },
    /**
     * Model: book
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'book',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'book',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'book',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'book',
        permissions: 'delete'
      }]
    },
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