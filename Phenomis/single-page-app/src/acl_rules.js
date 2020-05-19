module.exports = {
  aclRules: [
    //all models
    {
      roles: 'admin',
      allows: [{
        resources: [
          'role',
          'user',
          'breedingMethod',
          'contact',
          'environmentParameter',
          'event',
          'eventParameter',
          'germplasm',
          'image',
          'location',
          'method',
          'observation',
          'observationTreatment',
          'observationUnit',
          'observationUnitPosition',
          'observationUnit_to_event',
          'observationVariable',
          'ontologyReference',
          'program',
          'role_to_user',
          'scale',
          'season',
          'study',
          'study_to_contact',
          'study_to_season',
          'trait',
          'trial',
          'trial_to_contact',
        ],
        permissions: '*'
      }]
    },

    //models
    {
      /**
       * Model: breedingMethod
       */
      roles: 'breedingMethod_create',
      allows: [{
        resources: 'breedingMethod',
        permissions: 'create'
      }]
    },
    {
      roles: 'breedingMethod_read',
      allows: [{
        resources: 'breedingMethod',
        permissions: 'read'
      }]
    },
    {
      roles: 'breedingMethod_update',
      allows: [{
        resources: 'breedingMethod',
        permissions: 'update'
      }]
    },
    {
      roles: 'breedingMethod_delete',
      allows: [{
        resources: 'breedingMethod',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: contact
       */
      roles: 'contact_create',
      allows: [{
        resources: 'contact',
        permissions: 'create'
      }]
    },
    {
      roles: 'contact_read',
      allows: [{
        resources: 'contact',
        permissions: 'read'
      }]
    },
    {
      roles: 'contact_update',
      allows: [{
        resources: 'contact',
        permissions: 'update'
      }]
    },
    {
      roles: 'contact_delete',
      allows: [{
        resources: 'contact',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: environmentParameter
       */
      roles: 'environmentParameter_create',
      allows: [{
        resources: 'environmentParameter',
        permissions: 'create'
      }]
    },
    {
      roles: 'environmentParameter_read',
      allows: [{
        resources: 'environmentParameter',
        permissions: 'read'
      }]
    },
    {
      roles: 'environmentParameter_update',
      allows: [{
        resources: 'environmentParameter',
        permissions: 'update'
      }]
    },
    {
      roles: 'environmentParameter_delete',
      allows: [{
        resources: 'environmentParameter',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: event
       */
      roles: 'event_create',
      allows: [{
        resources: 'event',
        permissions: 'create'
      }]
    },
    {
      roles: 'event_read',
      allows: [{
        resources: 'event',
        permissions: 'read'
      }]
    },
    {
      roles: 'event_update',
      allows: [{
        resources: 'event',
        permissions: 'update'
      }]
    },
    {
      roles: 'event_delete',
      allows: [{
        resources: 'event',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: eventParameter
       */
      roles: 'eventParameter_create',
      allows: [{
        resources: 'eventParameter',
        permissions: 'create'
      }]
    },
    {
      roles: 'eventParameter_read',
      allows: [{
        resources: 'eventParameter',
        permissions: 'read'
      }]
    },
    {
      roles: 'eventParameter_update',
      allows: [{
        resources: 'eventParameter',
        permissions: 'update'
      }]
    },
    {
      roles: 'eventParameter_delete',
      allows: [{
        resources: 'eventParameter',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: germplasm
       */
      roles: 'germplasm_create',
      allows: [{
        resources: 'germplasm',
        permissions: 'create'
      }]
    },
    {
      roles: 'germplasm_read',
      allows: [{
        resources: 'germplasm',
        permissions: 'read'
      }]
    },
    {
      roles: 'germplasm_update',
      allows: [{
        resources: 'germplasm',
        permissions: 'update'
      }]
    },
    {
      roles: 'germplasm_delete',
      allows: [{
        resources: 'germplasm',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: image
       */
      roles: 'image_create',
      allows: [{
        resources: 'image',
        permissions: 'create'
      }]
    },
    {
      roles: 'image_read',
      allows: [{
        resources: 'image',
        permissions: 'read'
      }]
    },
    {
      roles: 'image_update',
      allows: [{
        resources: 'image',
        permissions: 'update'
      }]
    },
    {
      roles: 'image_delete',
      allows: [{
        resources: 'image',
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
       * Model: method
       */
      roles: 'method_create',
      allows: [{
        resources: 'method',
        permissions: 'create'
      }]
    },
    {
      roles: 'method_read',
      allows: [{
        resources: 'method',
        permissions: 'read'
      }]
    },
    {
      roles: 'method_update',
      allows: [{
        resources: 'method',
        permissions: 'update'
      }]
    },
    {
      roles: 'method_delete',
      allows: [{
        resources: 'method',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: observation
       */
      roles: 'observation_create',
      allows: [{
        resources: 'observation',
        permissions: 'create'
      }]
    },
    {
      roles: 'observation_read',
      allows: [{
        resources: 'observation',
        permissions: 'read'
      }]
    },
    {
      roles: 'observation_update',
      allows: [{
        resources: 'observation',
        permissions: 'update'
      }]
    },
    {
      roles: 'observation_delete',
      allows: [{
        resources: 'observation',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: observationTreatment
       */
      roles: 'observationTreatment_create',
      allows: [{
        resources: 'observationTreatment',
        permissions: 'create'
      }]
    },
    {
      roles: 'observationTreatment_read',
      allows: [{
        resources: 'observationTreatment',
        permissions: 'read'
      }]
    },
    {
      roles: 'observationTreatment_update',
      allows: [{
        resources: 'observationTreatment',
        permissions: 'update'
      }]
    },
    {
      roles: 'observationTreatment_delete',
      allows: [{
        resources: 'observationTreatment',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: observationUnit
       */
      roles: 'observationUnit_create',
      allows: [{
        resources: 'observationUnit',
        permissions: 'create'
      }]
    },
    {
      roles: 'observationUnit_read',
      allows: [{
        resources: 'observationUnit',
        permissions: 'read'
      }]
    },
    {
      roles: 'observationUnit_update',
      allows: [{
        resources: 'observationUnit',
        permissions: 'update'
      }]
    },
    {
      roles: 'observationUnit_delete',
      allows: [{
        resources: 'observationUnit',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: observationUnitPosition
       */
      roles: 'observationUnitPosition_create',
      allows: [{
        resources: 'observationUnitPosition',
        permissions: 'create'
      }]
    },
    {
      roles: 'observationUnitPosition_read',
      allows: [{
        resources: 'observationUnitPosition',
        permissions: 'read'
      }]
    },
    {
      roles: 'observationUnitPosition_update',
      allows: [{
        resources: 'observationUnitPosition',
        permissions: 'update'
      }]
    },
    {
      roles: 'observationUnitPosition_delete',
      allows: [{
        resources: 'observationUnitPosition',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: observationUnit_to_event
       */
      roles: 'observationUnit_to_event_create',
      allows: [{
        resources: 'observationUnit_to_event',
        permissions: 'create'
      }]
    },
    {
      roles: 'observationUnit_to_event_read',
      allows: [{
        resources: 'observationUnit_to_event',
        permissions: 'read'
      }]
    },
    {
      roles: 'observationUnit_to_event_update',
      allows: [{
        resources: 'observationUnit_to_event',
        permissions: 'update'
      }]
    },
    {
      roles: 'observationUnit_to_event_delete',
      allows: [{
        resources: 'observationUnit_to_event',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: observationVariable
       */
      roles: 'observationVariable_create',
      allows: [{
        resources: 'observationVariable',
        permissions: 'create'
      }]
    },
    {
      roles: 'observationVariable_read',
      allows: [{
        resources: 'observationVariable',
        permissions: 'read'
      }]
    },
    {
      roles: 'observationVariable_update',
      allows: [{
        resources: 'observationVariable',
        permissions: 'update'
      }]
    },
    {
      roles: 'observationVariable_delete',
      allows: [{
        resources: 'observationVariable',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: ontologyReference
       */
      roles: 'ontologyReference_create',
      allows: [{
        resources: 'ontologyReference',
        permissions: 'create'
      }]
    },
    {
      roles: 'ontologyReference_read',
      allows: [{
        resources: 'ontologyReference',
        permissions: 'read'
      }]
    },
    {
      roles: 'ontologyReference_update',
      allows: [{
        resources: 'ontologyReference',
        permissions: 'update'
      }]
    },
    {
      roles: 'ontologyReference_delete',
      allows: [{
        resources: 'ontologyReference',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: program
       */
      roles: 'program_create',
      allows: [{
        resources: 'program',
        permissions: 'create'
      }]
    },
    {
      roles: 'program_read',
      allows: [{
        resources: 'program',
        permissions: 'read'
      }]
    },
    {
      roles: 'program_update',
      allows: [{
        resources: 'program',
        permissions: 'update'
      }]
    },
    {
      roles: 'program_delete',
      allows: [{
        resources: 'program',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: role_to_user
       */
      roles: 'role_to_user_create',
      allows: [{
        resources: 'role_to_user',
        permissions: 'create'
      }]
    },
    {
      roles: 'role_to_user_read',
      allows: [{
        resources: 'role_to_user',
        permissions: 'read'
      }]
    },
    {
      roles: 'role_to_user_update',
      allows: [{
        resources: 'role_to_user',
        permissions: 'update'
      }]
    },
    {
      roles: 'role_to_user_delete',
      allows: [{
        resources: 'role_to_user',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: scale
       */
      roles: 'scale_create',
      allows: [{
        resources: 'scale',
        permissions: 'create'
      }]
    },
    {
      roles: 'scale_read',
      allows: [{
        resources: 'scale',
        permissions: 'read'
      }]
    },
    {
      roles: 'scale_update',
      allows: [{
        resources: 'scale',
        permissions: 'update'
      }]
    },
    {
      roles: 'scale_delete',
      allows: [{
        resources: 'scale',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: season
       */
      roles: 'season_create',
      allows: [{
        resources: 'season',
        permissions: 'create'
      }]
    },
    {
      roles: 'season_read',
      allows: [{
        resources: 'season',
        permissions: 'read'
      }]
    },
    {
      roles: 'season_update',
      allows: [{
        resources: 'season',
        permissions: 'update'
      }]
    },
    {
      roles: 'season_delete',
      allows: [{
        resources: 'season',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: study
       */
      roles: 'study_create',
      allows: [{
        resources: 'study',
        permissions: 'create'
      }]
    },
    {
      roles: 'study_read',
      allows: [{
        resources: 'study',
        permissions: 'read'
      }]
    },
    {
      roles: 'study_update',
      allows: [{
        resources: 'study',
        permissions: 'update'
      }]
    },
    {
      roles: 'study_delete',
      allows: [{
        resources: 'study',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: study_to_contact
       */
      roles: 'study_to_contact_create',
      allows: [{
        resources: 'study_to_contact',
        permissions: 'create'
      }]
    },
    {
      roles: 'study_to_contact_read',
      allows: [{
        resources: 'study_to_contact',
        permissions: 'read'
      }]
    },
    {
      roles: 'study_to_contact_update',
      allows: [{
        resources: 'study_to_contact',
        permissions: 'update'
      }]
    },
    {
      roles: 'study_to_contact_delete',
      allows: [{
        resources: 'study_to_contact',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: study_to_season
       */
      roles: 'study_to_season_create',
      allows: [{
        resources: 'study_to_season',
        permissions: 'create'
      }]
    },
    {
      roles: 'study_to_season_read',
      allows: [{
        resources: 'study_to_season',
        permissions: 'read'
      }]
    },
    {
      roles: 'study_to_season_update',
      allows: [{
        resources: 'study_to_season',
        permissions: 'update'
      }]
    },
    {
      roles: 'study_to_season_delete',
      allows: [{
        resources: 'study_to_season',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: trait
       */
      roles: 'trait_create',
      allows: [{
        resources: 'trait',
        permissions: 'create'
      }]
    },
    {
      roles: 'trait_read',
      allows: [{
        resources: 'trait',
        permissions: 'read'
      }]
    },
    {
      roles: 'trait_update',
      allows: [{
        resources: 'trait',
        permissions: 'update'
      }]
    },
    {
      roles: 'trait_delete',
      allows: [{
        resources: 'trait',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: trial
       */
      roles: 'trial_create',
      allows: [{
        resources: 'trial',
        permissions: 'create'
      }]
    },
    {
      roles: 'trial_read',
      allows: [{
        resources: 'trial',
        permissions: 'read'
      }]
    },
    {
      roles: 'trial_update',
      allows: [{
        resources: 'trial',
        permissions: 'update'
      }]
    },
    {
      roles: 'trial_delete',
      allows: [{
        resources: 'trial',
        permissions: 'delete'
      }]
    },
    {
      /**
       * Model: trial_to_contact
       */
      roles: 'trial_to_contact_create',
      allows: [{
        resources: 'trial_to_contact',
        permissions: 'create'
      }]
    },
    {
      roles: 'trial_to_contact_read',
      allows: [{
        resources: 'trial_to_contact',
        permissions: 'read'
      }]
    },
    {
      roles: 'trial_to_contact_update',
      allows: [{
        resources: 'trial_to_contact',
        permissions: 'update'
      }]
    },
    {
      roles: 'trial_to_contact_delete',
      allows: [{
        resources: 'trial_to_contact',
        permissions: 'delete'
      }]
    },
  ]
}