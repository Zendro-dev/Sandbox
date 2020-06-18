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
          'breeding_pool',
          'field_plot',
          'field_plot_treatment',
          'genotype',
          'individual',
          'marker_data',
          'measurement',
          'nuc_acid_library_result',
          'sample',
          'sequencing_experiment',
          'transcript_count',
        ],
        permissions: '*'
      }]
    },

    //models
    {
      /**
       * Model: breeding_pool
       */
      roles: 'breeding_pool_create',
      allows: [{
        resources: 'breeding_pool',
        permissions: 'create'
      }]
    },
    {
      roles: 'breeding_pool_read',
      allows: [{
        resources: 'breeding_pool',
        permissions: 'read'
      }]
    },
    {
      roles: 'breeding_pool_update',
      allows: [{
        resources: 'breeding_pool',
        permissions: 'update'
      }]
    },
    {
      roles: 'breeding_pool_delete',
      allows: [{
        resources: 'breeding_pool',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: field_plot
       */
      roles: 'field_plot_create',
      allows: [{
        resources: 'field_plot',
        permissions: 'create'
      }]
    },
    {
      roles: 'field_plot_read',
      allows: [{
        resources: 'field_plot',
        permissions: 'read'
      }]
    },
    {
      roles: 'field_plot_update',
      allows: [{
        resources: 'field_plot',
        permissions: 'update'
      }]
    },
    {
      roles: 'field_plot_delete',
      allows: [{
        resources: 'field_plot',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: field_plot_treatment
       */
      roles: 'field_plot_treatment_create',
      allows: [{
        resources: 'field_plot_treatment',
        permissions: 'create'
      }]
    },
    {
      roles: 'field_plot_treatment_read',
      allows: [{
        resources: 'field_plot_treatment',
        permissions: 'read'
      }]
    },
    {
      roles: 'field_plot_treatment_update',
      allows: [{
        resources: 'field_plot_treatment',
        permissions: 'update'
      }]
    },
    {
      roles: 'field_plot_treatment_delete',
      allows: [{
        resources: 'field_plot_treatment',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: genotype
       */
      roles: 'genotype_create',
      allows: [{
        resources: 'genotype',
        permissions: 'create'
      }]
    },
    {
      roles: 'genotype_read',
      allows: [{
        resources: 'genotype',
        permissions: 'read'
      }]
    },
    {
      roles: 'genotype_update',
      allows: [{
        resources: 'genotype',
        permissions: 'update'
      }]
    },
    {
      roles: 'genotype_delete',
      allows: [{
        resources: 'genotype',
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
       * Model: marker_data
       */
      roles: 'marker_data_create',
      allows: [{
        resources: 'marker_data',
        permissions: 'create'
      }]
    },
    {
      roles: 'marker_data_read',
      allows: [{
        resources: 'marker_data',
        permissions: 'read'
      }]
    },
    {
      roles: 'marker_data_update',
      allows: [{
        resources: 'marker_data',
        permissions: 'update'
      }]
    },
    {
      roles: 'marker_data_delete',
      allows: [{
        resources: 'marker_data',
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
       * Model: nuc_acid_library_result
       */
      roles: 'nuc_acid_library_result_create',
      allows: [{
        resources: 'nuc_acid_library_result',
        permissions: 'create'
      }]
    },
    {
      roles: 'nuc_acid_library_result_read',
      allows: [{
        resources: 'nuc_acid_library_result',
        permissions: 'read'
      }]
    },
    {
      roles: 'nuc_acid_library_result_update',
      allows: [{
        resources: 'nuc_acid_library_result',
        permissions: 'update'
      }]
    },
    {
      roles: 'nuc_acid_library_result_delete',
      allows: [{
        resources: 'nuc_acid_library_result',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: sample
       */
      roles: 'sample_create',
      allows: [{
        resources: 'sample',
        permissions: 'create'
      }]
    },
    {
      roles: 'sample_read',
      allows: [{
        resources: 'sample',
        permissions: 'read'
      }]
    },
    {
      roles: 'sample_update',
      allows: [{
        resources: 'sample',
        permissions: 'update'
      }]
    },
    {
      roles: 'sample_delete',
      allows: [{
        resources: 'sample',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: sequencing_experiment
       */
      roles: 'sequencing_experiment_create',
      allows: [{
        resources: 'sequencing_experiment',
        permissions: 'create'
      }]
    },
    {
      roles: 'sequencing_experiment_read',
      allows: [{
        resources: 'sequencing_experiment',
        permissions: 'read'
      }]
    },
    {
      roles: 'sequencing_experiment_update',
      allows: [{
        resources: 'sequencing_experiment',
        permissions: 'update'
      }]
    },
    {
      roles: 'sequencing_experiment_delete',
      allows: [{
        resources: 'sequencing_experiment',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: transcript_count
       */
      roles: 'transcript_count_create',
      allows: [{
        resources: 'transcript_count',
        permissions: 'create'
      }]
    },
    {
      roles: 'transcript_count_read',
      allows: [{
        resources: 'transcript_count',
        permissions: 'read'
      }]
    },
    {
      roles: 'transcript_count_update',
      allows: [{
        resources: 'transcript_count',
        permissions: 'update'
      }]
    },
    {
      roles: 'transcript_count_delete',
      allows: [{
        resources: 'transcript_count',
        permissions: 'delete'
      }]
    },
  ]
}