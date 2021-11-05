module.exports = `
  type sample{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    value: String

    """
    @original-field
    
    """
    plant_structure_development_stage: String

    """
    @original-field
    
    """
    plant_anatomical_entity: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    collection_date: DateTime

    """
    @original-field
    
    """
    external_id: String

    """
    @original-field
    
    """
    observation_unit_id: String

    """
    @original-field
    
    """
    data_file_ids: [String]

    observation_unit(search: searchObservation_unitInput): observation_unit
    
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
type SampleConnection{
  edges: [SampleEdge]
  samples: [sample]
  pageInfo: pageInfo!
}

type SampleEdge{
  cursor: String!
  node: sample!
}

  type VueTableSample{
    data : [sample]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum sampleField {
    id
    value
    plant_structure_development_stage
    plant_anatomical_entity
    description
    collection_date
    external_id
    observation_unit_id
    data_file_ids
  }
  
  input searchSampleInput {
    field: sampleField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchSampleInput]
  }

  input orderSampleInput{
    field: sampleField
    order: Order
  }

  input bulkAssociationSampleWithObservation_unit_idInput{
    id: ID!
    observation_unit_id: ID!
  }

  type Query {
    samples(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput! ): [sample]
    readOneSample(id: ID!): sample
    countSamples(search: searchSampleInput ): Int
    vueTableSample : VueTableSample
    csvTableTemplateSample: [String]
    samplesConnection(search:searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput! ): SampleConnection
  }

  type Mutation {
    addSample(id: ID!, value: String, plant_structure_development_stage: String, plant_anatomical_entity: String, description: String, collection_date: DateTime, external_id: String , addObservation_unit:ID  , addData_files:[ID] , skipAssociationsExistenceChecks:Boolean = false): sample!
    updateSample(id: ID!, value: String, plant_structure_development_stage: String, plant_anatomical_entity: String, description: String, collection_date: DateTime, external_id: String , addObservation_unit:ID, removeObservation_unit:ID   , addData_files:[ID], removeData_files:[ID]  , skipAssociationsExistenceChecks:Boolean = false): sample!
    deleteSample(id: ID!): String!
    bulkAddSampleCsv: String!
    bulkAssociateSampleWithObservation_unit_id(bulkAssociationInput: [bulkAssociationSampleWithObservation_unit_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateSampleWithObservation_unit_id(bulkAssociationInput: [bulkAssociationSampleWithObservation_unit_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;