module.exports = {
    aclRules: [
        //administrator role permission
        {
            roles: 'administrator',
            allows: [{
                resources: [
                    'role',
                    'user',
                    'role_to_user',
                ],
                permissions: '*'
            }]
        },

        // model and adapter permissions
        {
            roles: 'editor',
            allows: [{
                resources: [
                    'biological_material',
                    'data_file',
                    'environment',
                    'event',
                    'factor',
                    'investigation',
                    'observation_unit',
                    'observed_variable',
                    'person',
                    'sample',
                    'study',
                    'biological_material_local',
                    'biological_material_public',
                    'data_file_local',
                    'data_file_public',
                    'environment_local',
                    'environment_public',
                    'event_local',
                    'event_public',
                    'factor_local',
                    'factor_public',
                    'investigation_local',
                    'investigation_public',
                    'observation_unit_local',
                    'observation_unit_public',
                    'observed_variable_local',
                    'observed_variable_public',
                    'person_local',
                    'person_public',
                    'sample_local',
                    'sample_public',
                    'study_local',
                    'study_public',
                ],
                permissions: ['create', 'update', 'delete', 'search']
            }]
        },

        {
            roles: 'reader',
            allows: [{
                resources: [
                    'biological_material',
                    'data_file',
                    'environment',
                    'event',
                    'factor',
                    'investigation',
                    'observation_unit',
                    'observed_variable',
                    'person',
                    'sample',
                    'study',
                    'biological_material_local',
                    'biological_material_public',
                    'data_file_local',
                    'data_file_public',
                    'environment_local',
                    'environment_public',
                    'event_local',
                    'event_public',
                    'factor_local',
                    'factor_public',
                    'investigation_local',
                    'investigation_public',
                    'observation_unit_local',
                    'observation_unit_public',
                    'observed_variable_local',
                    'observed_variable_public',
                    'person_local',
                    'person_public',
                    'sample_local',
                    'sample_public',
                    'study_local',
                    'study_public',
                ],
                permissions: ['read']
            }]
        },
    ]
}