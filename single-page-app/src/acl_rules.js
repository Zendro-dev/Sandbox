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
      roles: 'editor',
      allows: [{
        resources: 'assay',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'assay',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'assay',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'assay',
        permissions: 'delete'
      }]
    },
    /**
     * Model: assayResult
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'assayResult',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'assayResult',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'assayResult',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'assayResult',
        permissions: 'delete'
      }]
    },
    /**
     * Model: contact
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'contact',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'contact',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'contact',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'contact',
        permissions: 'delete'
      }]
    },
    /**
     * Model: factor
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'factor',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'factor',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'factor',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'factor',
        permissions: 'delete'
      }]
    },
    /**
     * Model: fileAttachment
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'fileAttachment',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'fileAttachment',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'fileAttachment',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'fileAttachment',
        permissions: 'delete'
      }]
    },
    /**
     * Model: investigation
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'investigation',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'investigation',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'investigation',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'investigation',
        permissions: 'delete'
      }]
    },
    /**
     * Model: material
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'material',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'material',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'material',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'material',
        permissions: 'delete'
      }]
    },
    /**
     * Model: ontologyAnnotation
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'ontologyAnnotation',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'ontologyAnnotation',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'ontologyAnnotation',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'ontologyAnnotation',
        permissions: 'delete'
      }]
    },
    /**
     * Model: protocol
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'protocol',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'protocol',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'protocol',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'protocol',
        permissions: 'delete'
      }]
    },
    /**
     * Model: study
     */
    {
      roles: 'editor',
      allows: [{
        resources: 'study',
        permissions: 'create'
      }]
    },
    {
      roles: 'reader',
      allows: [{
        resources: 'study',
        permissions: 'read'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'study',
        permissions: 'update'
      }]
    },
    {
      roles: 'editor',
      allows: [{
        resources: 'study',
        permissions: 'delete'
      }]
    },
  ]
}