module.exports = `
type environment{
  """
  @original-field
  """
  id: ID

  """
  @original-field
  
  """
  parameter: String
"""
  @original-field
  
  """
  value: String
"""
  @original-field
  
  """
  study_id: String


study(search: searchStudyInput): study

  """
  @misc-field
  """
  asCursor: String!
}

type EnvironmentConnection{
edges: [EnvironmentEdge]
environments: [environment]
pageInfo: pageInfo!
}

type EnvironmentEdge{
cursor: String!
node: environment!
}

type VueTableEnvironment{
  data : [environment]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum environmentField {
  id
  parameter
  value
  study_id

}

input searchEnvironmentInput {
  field: environmentField
  value: String
  valueType: InputType
  operator: GenericPrestoSqlOperator  excludeAdapterNames: [String]
  search: [searchEnvironmentInput]
}

input orderEnvironmentInput{
  field: environmentField
  order: Order
}

input bulkAssociationEnvironmentWithStudy_idInput{
  id: ID!
  study_id: ID!
}

type Query {
  readOneEnvironment(id: ID!): environment
  countEnvironments(search: searchEnvironmentInput ): Int
  vueTableEnvironment : VueTableEnvironment  csvTableTemplateEnvironment: [String]
  environmentsConnection(search:searchEnvironmentInput, order: [ orderEnvironmentInput ], pagination: paginationCursorInput!): EnvironmentConnection
  validateEnvironmentForCreation(id: ID!, parameter: String, value: String , addStudy:ID   , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateEnvironmentForUpdating(id: ID!, parameter: String, value: String , addStudy:ID, removeStudy:ID    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateEnvironmentForDeletion(id: ID!): Boolean!
  validateEnvironmentAfterReading(id: ID!): Boolean!
}

type Mutation {
  addEnvironment(id: ID!, parameter: String, value: String , addStudy:ID   , skipAssociationsExistenceChecks:Boolean = false): environment!
  updateEnvironment(id: ID!, parameter: String, value: String , addStudy:ID, removeStudy:ID    , skipAssociationsExistenceChecks:Boolean = false): environment!
  deleteEnvironment(id: ID!): String!
  bulkAddEnvironmentCsv: String
  bulkAssociateEnvironmentWithStudy_id(bulkAssociationInput: [bulkAssociationEnvironmentWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  bulkDisAssociateEnvironmentWithStudy_id(bulkAssociationInput: [bulkAssociationEnvironmentWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
}
`;