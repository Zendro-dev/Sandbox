module.exports = `
type environmentParameter{
  """
  @original-field
  """
  environmentParameterDbId: ID

"""
  @original-field
  
  """
  description: String

"""
  @original-field
  
  """
  parameterName: String

"""
  @original-field
  
  """
  parameterPUI: String

"""
  @original-field
  
  """
  unit: String

"""
  @original-field
  
  """
  unitPUI: String

"""
  @original-field
  
  """
  value: String

"""
  @original-field
  
  """
  valuePUI: String

"""
  @original-field
  
  """
  studyDbId: String

study(search: searchStudyInput): study
}

type EnvironmentParameterConnection{
edges: [EnvironmentParameterEdge]
pageInfo: pageInfo!
}

type EnvironmentParameterEdge{
cursor: String!
node: environmentParameter!
}

type VueTableEnvironmentParameter{
  data : [environmentParameter]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum environmentParameterField {
  environmentParameterDbId
  description
  parameterName
  parameterPUI
  unit
  unitPUI
  value
  valuePUI
  studyDbId
}

input searchEnvironmentParameterInput {
  field: environmentParameterField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchEnvironmentParameterInput]
}

input orderEnvironmentParameterInput{
  field: environmentParameterField
  order: Order
}

type Query {
  readOneEnvironmentParameter(environmentParameterDbId: ID!): environmentParameter
  countEnvironmentParameters(search: searchEnvironmentParameterInput ): Int
  vueTableEnvironmentParameter : VueTableEnvironmentParameter  csvTableTemplateEnvironmentParameter: [String]

  environmentParametersConnection(search:searchEnvironmentParameterInput, order: [ orderEnvironmentParameterInput ], pagination: paginationCursorInput ): EnvironmentParameterConnection
}

  type Mutation {
  addEnvironmentParameter(environmentParameterDbId: ID!, description: String, parameterName: String, parameterPUI: String, unit: String, unitPUI: String, value: String, valuePUI: String , addStudy:ID , skipAssociationsExistenceChecks:Boolean = false): environmentParameter!
  updateEnvironmentParameter(environmentParameterDbId: ID!, description: String, parameterName: String, parameterPUI: String, unit: String, unitPUI: String, value: String, valuePUI: String , addStudy:ID, removeStudy:ID  , skipAssociationsExistenceChecks:Boolean = false): environmentParameter!
deleteEnvironmentParameter(environmentParameterDbId: ID!): String!
bulkAddEnvironmentParameterCsv: [environmentParameter] }

`;