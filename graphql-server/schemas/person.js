module.exports = `
type person{
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
  email: String
"""
  @original-field
  
  """
  role: String
"""
  @original-field
  
  """
  affiliation: String
"""
  @original-field
  
  """
  investigation_ids: [String]
"""
  @original-field
  
  """
  study_ids: [String]


  """
  @search-request
  """
  investigationsConnection(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationCursorInput!): InvestigationConnection
  """
  @count-request
  """
  countFilteredInvestigations(search: searchInvestigationInput) : Int
  """
  @search-request
  """
  studiesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection
  """
  @count-request
  """
  countFilteredStudies(search: searchStudyInput) : Int

  """
  @misc-field
  """
  asCursor: String!
}

type PersonConnection{
edges: [PersonEdge]
people: [person]
pageInfo: pageInfo!
}

type PersonEdge{
cursor: String!
node: person!
}

type VueTablePerson{
  data : [person]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum personField {
  id
  name
  email
  role
  affiliation
  investigation_ids
  study_ids

}

input searchPersonInput {
  field: personField
  value: String
  valueType: InputType
  operator: GenericPrestoSqlOperator  excludeAdapterNames: [String]
  search: [searchPersonInput]
}

input orderPersonInput{
  field: personField
  order: Order
}



type Query {
  readOnePerson(id: ID!): person
  countPeople(search: searchPersonInput ): Int
  vueTablePerson : VueTablePerson  csvTableTemplatePerson: [String]
  peopleConnection(search:searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput!): PersonConnection
  validatePersonForCreation(id: ID!, name: String, email: String, role: String, affiliation: String   , addInvestigations:[ID], addStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validatePersonForUpdating(id: ID!, name: String, email: String, role: String, affiliation: String   , addInvestigations:[ID], removeInvestigations:[ID] , addStudies:[ID], removeStudies:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validatePersonForDeletion(id: ID!): Boolean!
  validatePersonAfterReading(id: ID!): Boolean!
}

type Mutation {
  addPerson(id: ID!, name: String, email: String, role: String, affiliation: String   , addInvestigations:[ID], addStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): person!
  updatePerson(id: ID!, name: String, email: String, role: String, affiliation: String   , addInvestigations:[ID], removeInvestigations:[ID] , addStudies:[ID], removeStudies:[ID]  , skipAssociationsExistenceChecks:Boolean = false): person!
  deletePerson(id: ID!): String!
  bulkAddPersonCsv: String
  }
`;