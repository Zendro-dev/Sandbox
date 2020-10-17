module.exports = `
  type sample_measurement{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    variable: String

    """
    @original-field
    
    """
    value: Float

    """
    @original-field
    
    """
    unit: String

    """
    @original-field
    
    """
    CAS_number: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    sample_id: Int

    sample(search: searchSampleInput): sample
    
    }
type Sample_measurementConnection{
  edges: [Sample_measurementEdge]
  pageInfo: pageInfo!
}

type Sample_measurementEdge{
  cursor: String!
  node: sample_measurement!
}

  type VueTableSample_measurement{
    data : [sample_measurement]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum sample_measurementField {
    id
    variable
    value
    unit
    CAS_number
    description
    sample_id
  }
  input searchSample_measurementInput {
    field: sample_measurementField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchSample_measurementInput]
  }

  input orderSample_measurementInput{
    field: sample_measurementField
    order: Order
  }

  input bulkAssociationSample_measurementWithSample_idInput{
    id: ID!
    sample_id: ID!
  }

  type Query {
    sample_measurements(search: searchSample_measurementInput, order: [ orderSample_measurementInput ], pagination: paginationInput! ): [sample_measurement]
    readOneSample_measurement(id: ID!): sample_measurement
    countSample_measurements(search: searchSample_measurementInput ): Int
    vueTableSample_measurement : VueTableSample_measurement    csvTableTemplateSample_measurement: [String]
    sample_measurementsConnection(search:searchSample_measurementInput, order: [ orderSample_measurementInput ], pagination: paginationCursorInput! ): Sample_measurementConnection
  }

  type Mutation {
    addSample_measurement( variable: String, value: Float, unit: String, CAS_number: String, description: String , addSample:ID   , skipAssociationsExistenceChecks:Boolean = false): sample_measurement!
    updateSample_measurement(id: ID!, variable: String, value: Float, unit: String, CAS_number: String, description: String , addSample:ID, removeSample:ID    , skipAssociationsExistenceChecks:Boolean = false): sample_measurement!
    deleteSample_measurement(id: ID!): String!
    bulkAddSample_measurementCsv: String!
    bulkAssociateSample_measurementWithSample_id(bulkAssociationInput: [bulkAssociationSample_measurementWithSample_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateSample_measurementWithSample_id(bulkAssociationInput: [bulkAssociationSample_measurementWithSample_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;