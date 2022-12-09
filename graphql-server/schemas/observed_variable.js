module.exports = `
type observed_variable{
  """
  @original-field
  """
  id: ID

  """
  @original-field
  
  """
  name: String
"""
  @original-field
  
  """
  accession_number: String
"""
  @original-field
  
  """
  trait: String
"""
  @original-field
  
  """
  trait_accession_number: String
"""
  @original-field
  
  """
  method: String
"""
  @original-field
  
  """
  method_accession_number: String
"""
  @original-field
  
  """
  method_description: String
"""
  @original-field
  
  """
  scale: String
"""
  @original-field
  
  """
  scale_accession_number: String
"""
  @original-field
  
  """
  time_scale: String
"""
  @original-field
  
  """
  study_ids: [String]
"""
  @original-field
  
  """
  data_file_ids: [Int]


  """
  @search-request
  """
  studiesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection
  """
  @count-request
  """
  countFilteredStudies(search: searchStudyInput) : Int
  """
  @search-request
  """
  data_filesConnection(search: searchData_fileInput, order: [ orderData_fileInput ], pagination: paginationCursorInput!): Data_fileConnection
  """
  @count-request
  """
  countFilteredData_files(search: searchData_fileInput) : Int

  """
  @misc-field
  """
  asCursor: String!
}

type Observed_variableConnection{
edges: [Observed_variableEdge]
observed_variables: [observed_variable]
pageInfo: pageInfo!
}

type Observed_variableEdge{
cursor: String!
node: observed_variable!
}


enum observed_variableField {
  id
  name
  accession_number
  trait
  trait_accession_number
  method
  method_accession_number
  method_description
  scale
  scale_accession_number
  time_scale
  study_ids
  data_file_ids

}

input searchObserved_variableInput {
  field: observed_variableField
  value: String
  valueType: InputType
  operator: GenericPrestoSqlOperator  excludeAdapterNames: [String]
  search: [searchObserved_variableInput]
}

input orderObserved_variableInput{
  field: observed_variableField
  order: Order
}



type Query {
  readOneObserved_variable(id: ID!): observed_variable
  countObserved_variables(search: searchObserved_variableInput ): Int
  csvTableTemplateObserved_variable: [String]
  observed_variablesConnection(search:searchObserved_variableInput, order: [ orderObserved_variableInput ], pagination: paginationCursorInput!): Observed_variableConnection
  validateObserved_variableForCreation(id: ID!, name: String, accession_number: String, trait: String, trait_accession_number: String, method: String, method_accession_number: String, method_description: String, scale: String, scale_accession_number: String, time_scale: String   , addStudies:[ID], addData_files:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateObserved_variableForUpdating(id: ID!, name: String, accession_number: String, trait: String, trait_accession_number: String, method: String, method_accession_number: String, method_description: String, scale: String, scale_accession_number: String, time_scale: String   , addStudies:[ID], removeStudies:[ID] , addData_files:[ID], removeData_files:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateObserved_variableForDeletion(id: ID!): Boolean!
  validateObserved_variableAfterReading(id: ID!): Boolean!
  """
  observed_variablesZendroDefinition would return the static Zendro data model definition
  """
  observed_variablesZendroDefinition: GraphQLJSONObject
}

type Mutation {
  addObserved_variable(id: ID!, name: String, accession_number: String, trait: String, trait_accession_number: String, method: String, method_accession_number: String, method_description: String, scale: String, scale_accession_number: String, time_scale: String   , addStudies:[ID], addData_files:[ID] , skipAssociationsExistenceChecks:Boolean = false): observed_variable!
  updateObserved_variable(id: ID!, name: String, accession_number: String, trait: String, trait_accession_number: String, method: String, method_accession_number: String, method_description: String, scale: String, scale_accession_number: String, time_scale: String   , addStudies:[ID], removeStudies:[ID] , addData_files:[ID], removeData_files:[ID]  , skipAssociationsExistenceChecks:Boolean = false): observed_variable!
  deleteObserved_variable(id: ID!): String!
  }
`;