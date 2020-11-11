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
     * Model: assay
     */
    {
      roles: 'reader',
      allows: [{
        resources: 'assay',
        permissions: 'read'
      }]
    },
    /**
     * Model: assayResult
     */
    {
      roles: 'reader',
      allows: [{
        resources: 'assayResult',
        permissions: 'read'
      }]
    },
    /**
     * Model: contact
     */
    {
      roles: 'reader',
      allows: [{
        resources: 'contact',
        permissions: 'read'
      }]
    },
    /**
     * Model: factor
     */
    {
      roles: 'reader',
      allows: [{
        resources: 'factor',
        permissions: 'read'
      }]
    },
    /**
     * Model: fileAttachment
     */
    {
      roles: 'reader',
      allows: [{
        resources: 'fileAttachment',
        permissions: 'read'
      }]
    },
    /**
     * Model: investigation
     */
    {
      roles: 'reader',
      allows: [{
        resources: 'investigation',
        permissions: 'read'
      }]
    },
    /**
     * Model: material
     */
    {
      roles: 'reader',
      allows: [{
        resources: 'material',
        permissions: 'read'
      }]
    },
    /**
     * Model: ontologyAnnotation
     */
    {
      roles: 'reader',
      allows: [{
        resources: 'ontologyAnnotation',
        permissions: 'read'
      }]
    },
    /**
     * Model: protocol
     */
    {
      roles: 'reader',
      allows: [{
        resources: 'protocol',
        permissions: 'read'
      }]
    },
    /**
     * Model: study
     */
    {
      roles: 'reader',
      allows: [{
        resources: 'study',
        permissions: 'read'
      }]
    },
  ]
}
