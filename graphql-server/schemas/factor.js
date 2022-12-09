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
  observation_unitsConnection(search: searchObservation_unitInput, order: [ orderObservation_unitInput ], pagination: paginationCursorInput!): Observation_unitConnection
  """
  @count-request
  """
  countFilteredObservation_units(search: searchObservation_unitInput) : Int

  """
  @misc-field
  """
  asCursor: String!
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
  operator: GenericPrestoSqlOperator  excludeAdapterNames: [String]
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
  readOneFactor(id: ID!): factor
  countFactors(search: searchFactorInput ): Int
  csvTableTemplateFactor: [String]
  factorsConnection(search:searchFactorInput, order: [ orderFactorInput ], pagination: paginationCursorInput!): FactorConnection
  validateFactorForCreation(id: ID!, type: String, description: String, values: [String] , addStudy:ID  , addObservation_units:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateFactorForUpdating(id: ID!, type: String, description: String, values: [String] , addStudy:ID, removeStudy:ID   , addObservation_units:[ID], removeObservation_units:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateFactorForDeletion(id: ID!): Boolean!
  validateFactorAfterReading(id: ID!): Boolean!
  """
  factorsZendroDefinition would return the static Zendro data model definition
  """
  factorsZendroDefinition: GraphQLJSONObject
}

type Mutation {
  addFactor(id: ID!, type: String, description: String, values: [String] , addStudy:ID  , addObservation_units:[ID] , skipAssociationsExistenceChecks:Boolean = false): factor!
  updateFactor(id: ID!, type: String, description: String, values: [String] , addStudy:ID, removeStudy:ID   , addObservation_units:[ID], removeObservation_units:[ID]  , skipAssociationsExistenceChecks:Boolean = false): factor!
  deleteFactor(id: ID!): String!
    bulkAssociateFactorWithStudy_id(bulkAssociationInput: [bulkAssociationFactorWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  bulkDisAssociateFactorWithStudy_id(bulkAssociationInput: [bulkAssociationFactorWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
}
`;