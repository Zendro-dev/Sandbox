module.exports = `
  type factor{
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
    description: String

    """
    @original-field
    
    """
    values: [String]

    """
    @original-field
    
    """
    study_id: String

    """
    @original-field
    
    """
    observation_unit_ids: [String]

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
  
    }
type FactorConnection{
  edges: [FactorEdge]
  factors: [factor]
  pageInfo: pageInfo!
}

type FactorEdge{
  cursor: String!
  node: factor!
}

  type VueTableFactor{
    data : [factor]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum factorField {
    id
    type
    description
    values
    study_id
    observation_unit_ids
  }
  
  input searchFactorInput {
    field: factorField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchFactorInput]
  }

  input orderFactorInput{
    field: factorField
    order: Order
  }

  input bulkAssociationFactorWithStudy_idInput{
    id: ID!
    study_id: ID!
  }

  type Query {
    factors(search: searchFactorInput, order: [ orderFactorInput ], pagination: paginationInput! ): [factor]
    readOneFactor(id: ID!): factor
    countFactors(search: searchFactorInput ): Int
    vueTableFactor : VueTableFactor
    csvTableTemplateFactor: [String]
    factorsConnection(search:searchFactorInput, order: [ orderFactorInput ], pagination: paginationCursorInput! ): FactorConnection
  }

  type Mutation {
    addFactor(id: ID!, type: String, description: String, values: [String] , addStudy:ID  , addObservation_units:[ID] , skipAssociationsExistenceChecks:Boolean = false): factor!
    updateFactor(id: ID!, type: String, description: String, values: [String] , addStudy:ID, removeStudy:ID   , addObservation_units:[ID], removeObservation_units:[ID]  , skipAssociationsExistenceChecks:Boolean = false): factor!
    deleteFactor(id: ID!): String!
    bulkAddFactorCsv: String!
    bulkAssociateFactorWithStudy_id(bulkAssociationInput: [bulkAssociationFactorWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateFactorWithStudy_id(bulkAssociationInput: [bulkAssociationFactorWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;