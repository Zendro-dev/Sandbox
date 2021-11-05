module.exports = `
  type data_file{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    url: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    version: String

    """
    @original-field
    
    """
    study_id: String

    """
    @original-field
    
    """
    observation_unit_ids: [String]

    """
    @original-field
    
    """
    observed_variable_ids: [String]

    """
    @original-field
    
    """
    sample_ids: [String]

    study(search: searchStudyInput): study
    
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
type Data_fileConnection{
  edges: [Data_fileEdge]
  data_files: [data_file]
  pageInfo: pageInfo!
}

type Data_fileEdge{
  cursor: String!
  node: data_file!
}

  type VueTableData_file{
    data : [data_file]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum data_fileField {
    id
    url
    description
    version
    study_id
    observation_unit_ids
    observed_variable_ids
    sample_ids
  }
  
  input searchData_fileInput {
    field: data_fileField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchData_fileInput]
  }

  input orderData_fileInput{
    field: data_fileField
    order: Order
  }

  input bulkAssociationData_fileWithStudy_idInput{
    id: ID!
    study_id: ID!
  }

  type Query {
    data_files(search: searchData_fileInput, order: [ orderData_fileInput ], pagination: paginationInput! ): [data_file]
    readOneData_file(id: ID!): data_file
    countData_files(search: searchData_fileInput ): Int
    vueTableData_file : VueTableData_file
    csvTableTemplateData_file: [String]
    data_filesConnection(search:searchData_fileInput, order: [ orderData_fileInput ], pagination: paginationCursorInput! ): Data_fileConnection
  }

  type Mutation {
    addData_file(id: ID!, url: String, description: String, version: String , addStudy:ID  , addObservation_units:[ID], addObserved_variables:[ID], addSamples:[ID] , skipAssociationsExistenceChecks:Boolean = false): data_file!
    updateData_file(id: ID!, url: String, description: String, version: String , addStudy:ID, removeStudy:ID   , addObservation_units:[ID], removeObservation_units:[ID] , addObserved_variables:[ID], removeObserved_variables:[ID] , addSamples:[ID], removeSamples:[ID]  , skipAssociationsExistenceChecks:Boolean = false): data_file!
    deleteData_file(id: ID!): String!
    bulkAddData_fileCsv: String!
    bulkAssociateData_fileWithStudy_id(bulkAssociationInput: [bulkAssociationData_fileWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateData_fileWithStudy_id(bulkAssociationInput: [bulkAssociationData_fileWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;