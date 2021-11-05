module.exports = `
  type study{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    title: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    startDate: Date

    """
    @original-field
    
    """
    endDate: Date

    """
    @original-field
    
    """
    institution: String

    """
    @original-field
    
    """
    location_country: String

    """
    @original-field
    
    """
    location_latitude: String

    """
    @original-field
    
    """
    location_longitude: String

    """
    @original-field
    
    """
    location_altitude: String

    """
    @original-field
    
    """
    experimental_site_name: String

    """
    @original-field
    
    """
    experimental_design_type: String

    """
    @original-field
    
    """
    experimental_design_description: String

    """
    @original-field
    
    """
    experimental_design_map: String

    """
    @original-field
    
    """
    observation_unit_level_hirarchy: String

    """
    @original-field
    
    """
    observation_unit_description: String

    """
    @original-field
    
    """
    growth_facility: String

    """
    @original-field
    
    """
    growth_facility_description: String

    """
    @original-field
    
    """
    cultural_practices: String

    """
    @original-field
    
    """
    investigation_id: String

    """
    @original-field
    
    """
    person_ids: [String]

    """
    @original-field
    
    """
    observed_variable_ids: [String]

    """
    @original-field
    
    """
    biological_material_ids: [String]

    investigation(search: searchInvestigationInput): investigation
    
    """
    @search-request
    """
    peopleFilter(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput!): [person]


    """
    @search-request
    """
    peopleConnection(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput!): PersonConnection

    """
    @count-request
    """
    countFilteredPeople(search: searchPersonInput) : Int
  
    """
    @search-request
    """
    environment_parametersFilter(search: searchEnvironmentInput, order: [ orderEnvironmentInput ], pagination: paginationInput!): [environment]


    """
    @search-request
    """
    environment_parametersConnection(search: searchEnvironmentInput, order: [ orderEnvironmentInput ], pagination: paginationCursorInput!): EnvironmentConnection

    """
    @count-request
    """
    countFilteredEnvironment_parameters(search: searchEnvironmentInput) : Int
  
    """
    @search-request
    """
    eventsFilter(search: searchEventInput, order: [ orderEventInput ], pagination: paginationInput!): [event]


    """
    @search-request
    """
    eventsConnection(search: searchEventInput, order: [ orderEventInput ], pagination: paginationCursorInput!): EventConnection

    """
    @count-request
    """
    countFilteredEvents(search: searchEventInput) : Int
  
    """
    @search-request
    """
    observation_unitsFilter(search: searchObservation_unitInput, order: [ orderObservation_unitInput ], pagination: paginationInput!): [observation_unit]


    """
    @search-request
    """
    observation_unitsConnection(search: searchObservation_unitInput, order: [ orderObservation_unitInput ], pagination: paginationCursorInput!): Observation_unitConnection

    """
    @count-request
    """
    countFilteredObservation_units(search: searchObservation_unitInput) : Int
  
    """
    @search-request
    """
    observed_variablesFilter(search: searchObserved_variableInput, order: [ orderObserved_variableInput ], pagination: paginationInput!): [observed_variable]


    """
    @search-request
    """
    observed_variablesConnection(search: searchObserved_variableInput, order: [ orderObserved_variableInput ], pagination: paginationCursorInput!): Observed_variableConnection

    """
    @count-request
    """
    countFilteredObserved_variables(search: searchObserved_variableInput) : Int
  
    """
    @search-request
    """
    biological_materialsFilter(search: searchBiological_materialInput, order: [ orderBiological_materialInput ], pagination: paginationInput!): [biological_material]


    """
    @search-request
    """
    biological_materialsConnection(search: searchBiological_materialInput, order: [ orderBiological_materialInput ], pagination: paginationCursorInput!): Biological_materialConnection

    """
    @count-request
    """
    countFilteredBiological_materials(search: searchBiological_materialInput) : Int
  
    """
    @search-request
    """
    factorsFilter(search: searchFactorInput, order: [ orderFactorInput ], pagination: paginationInput!): [factor]


    """
    @search-request
    """
    factorsConnection(search: searchFactorInput, order: [ orderFactorInput ], pagination: paginationCursorInput!): FactorConnection

    """
    @count-request
    """
    countFilteredFactors(search: searchFactorInput) : Int
  
    """
    @search-request
    """
    data_filesFilter(search: searchData_fileInput, order: [ orderData_fileInput ], pagination: paginationInput!): [data_file]


    """
    @search-request
    """
    data_filesConnection(search: searchData_fileInput, order: [ orderData_fileInput ], pagination: paginationCursorInput!): Data_fileConnection

    """
    @count-request
    """
    countFilteredData_files(search: searchData_fileInput) : Int
  
    }
type StudyConnection{
  edges: [StudyEdge]
  studies: [study]
  pageInfo: pageInfo!
}

type StudyEdge{
  cursor: String!
  node: study!
}

  type VueTableStudy{
    data : [study]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum studyField {
    id
    title
    description
    startDate
    endDate
    institution
    location_country
    location_latitude
    location_longitude
    location_altitude
    experimental_site_name
    experimental_design_type
    experimental_design_description
    experimental_design_map
    observation_unit_level_hirarchy
    observation_unit_description
    growth_facility
    growth_facility_description
    cultural_practices
    investigation_id
    person_ids
    observed_variable_ids
    biological_material_ids
  }
  
  input searchStudyInput {
    field: studyField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchStudyInput]
  }

  input orderStudyInput{
    field: studyField
    order: Order
  }

  input bulkAssociationStudyWithInvestigation_idInput{
    id: ID!
    investigation_id: ID!
  }

  type Query {
    studies(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput! ): [study]
    readOneStudy(id: ID!): study
    countStudies(search: searchStudyInput ): Int
    vueTableStudy : VueTableStudy
    csvTableTemplateStudy: [String]
    studiesConnection(search:searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput! ): StudyConnection
  }

  type Mutation {
    addStudy(id: ID!, title: String, description: String, startDate: Date, endDate: Date, institution: String, location_country: String, location_latitude: String, location_longitude: String, location_altitude: String, experimental_site_name: String, experimental_design_type: String, experimental_design_description: String, experimental_design_map: String, observation_unit_level_hirarchy: String, observation_unit_description: String, growth_facility: String, growth_facility_description: String, cultural_practices: String , addInvestigation:ID  , addPeople:[ID], addEnvironment_parameters:[ID], addEvents:[ID], addObservation_units:[ID], addObserved_variables:[ID], addBiological_materials:[ID], addFactors:[ID], addData_files:[ID] , skipAssociationsExistenceChecks:Boolean = false): study!
    updateStudy(id: ID!, title: String, description: String, startDate: Date, endDate: Date, institution: String, location_country: String, location_latitude: String, location_longitude: String, location_altitude: String, experimental_site_name: String, experimental_design_type: String, experimental_design_description: String, experimental_design_map: String, observation_unit_level_hirarchy: String, observation_unit_description: String, growth_facility: String, growth_facility_description: String, cultural_practices: String , addInvestigation:ID, removeInvestigation:ID   , addPeople:[ID], removePeople:[ID] , addEnvironment_parameters:[ID], removeEnvironment_parameters:[ID] , addEvents:[ID], removeEvents:[ID] , addObservation_units:[ID], removeObservation_units:[ID] , addObserved_variables:[ID], removeObserved_variables:[ID] , addBiological_materials:[ID], removeBiological_materials:[ID] , addFactors:[ID], removeFactors:[ID] , addData_files:[ID], removeData_files:[ID]  , skipAssociationsExistenceChecks:Boolean = false): study!
    deleteStudy(id: ID!): String!
    bulkAddStudyCsv: String!
    bulkAssociateStudyWithInvestigation_id(bulkAssociationInput: [bulkAssociationStudyWithInvestigation_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateStudyWithInvestigation_id(bulkAssociationInput: [bulkAssociationStudyWithInvestigation_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;