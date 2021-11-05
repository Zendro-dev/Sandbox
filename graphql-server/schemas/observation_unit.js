module.exports = `
  type observation_unit{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    type: String

    """
    @original-field
    
    """
    external_id: String

    """
    @original-field
    
    """
    spatial_distribution: String

    """
    @original-field
    
    """
    study_id: String

    """
    @original-field
    
    """
    biological_material_ids: [String]

    """
    @original-field
    
    """
    data_file_ids: [Int]

    """
    @original-field
    
    """
    event_ids: [Int]

    """
    @original-field
    
    """
    factor_ids: [Int]

    study(search: searchStudyInput): study
    
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
    data_filesFilter(search: searchData_fileInput, order: [ orderData_fileInput ], pagination: paginationInput!): [data_file]


    """
    @search-request
    """
    data_filesConnection(search: searchData_fileInput, order: [ orderData_fileInput ], pagination: paginationCursorInput!): Data_fileConnection

    """
    @count-request
    """
    countFilteredData_files(search: searchData_fileInput) : Int
  
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
    samplesFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput!): [sample]


    """
    @search-request
    """
    samplesConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput!): SampleConnection

    """
    @count-request
    """
    countFilteredSamples(search: searchSampleInput) : Int
  
    }
type Observation_unitConnection{
  edges: [Observation_unitEdge]
  observation_units: [observation_unit]
  pageInfo: pageInfo!
}

type Observation_unitEdge{
  cursor: String!
  node: observation_unit!
}

  type VueTableObservation_unit{
    data : [observation_unit]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum observation_unitField {
    id
    type
    external_id
    spatial_distribution
    study_id
    biological_material_ids
    data_file_ids
    event_ids
    factor_ids
  }
  
  input searchObservation_unitInput {
    field: observation_unitField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchObservation_unitInput]
  }

  input orderObservation_unitInput{
    field: observation_unitField
    order: Order
  }

  input bulkAssociationObservation_unitWithStudy_idInput{
    id: ID!
    study_id: ID!
  }

  type Query {
    observation_units(search: searchObservation_unitInput, order: [ orderObservation_unitInput ], pagination: paginationInput! ): [observation_unit]
    readOneObservation_unit(id: ID!): observation_unit
    countObservation_units(search: searchObservation_unitInput ): Int
    vueTableObservation_unit : VueTableObservation_unit
    csvTableTemplateObservation_unit: [String]
    observation_unitsConnection(search:searchObservation_unitInput, order: [ orderObservation_unitInput ], pagination: paginationCursorInput! ): Observation_unitConnection
  }

  type Mutation {
    addObservation_unit(id: ID!, type: String, external_id: String, spatial_distribution: String , addStudy:ID  , addBiological_materials:[ID], addData_files:[ID], addEvents:[ID], addFactors:[ID], addSamples:[ID] , skipAssociationsExistenceChecks:Boolean = false): observation_unit!
    updateObservation_unit(id: ID!, type: String, external_id: String, spatial_distribution: String , addStudy:ID, removeStudy:ID   , addBiological_materials:[ID], removeBiological_materials:[ID] , addData_files:[ID], removeData_files:[ID] , addEvents:[ID], removeEvents:[ID] , addFactors:[ID], removeFactors:[ID] , addSamples:[ID], removeSamples:[ID]  , skipAssociationsExistenceChecks:Boolean = false): observation_unit!
    deleteObservation_unit(id: ID!): String!
    bulkAddObservation_unitCsv: String!
    bulkAssociateObservation_unitWithStudy_id(bulkAssociationInput: [bulkAssociationObservation_unitWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservation_unitWithStudy_id(bulkAssociationInput: [bulkAssociationObservation_unitWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;