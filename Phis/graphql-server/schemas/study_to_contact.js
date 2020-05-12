module.exports = `
type study_to_contact{
  """
  @original-field
  """
  id: ID

"""
  @original-field
  
  """
  studyDbId: String

"""
  @original-field
  
  """
  contactDbId: String

study(search: searchStudyInput): study
contact(search: searchContactInput): contact
}

type Study_to_contactConnection{
edges: [Study_to_contactEdge]
pageInfo: pageInfo!
}

type Study_to_contactEdge{
cursor: String!
node: study_to_contact!
}

type VueTableStudy_to_contact{
  data : [study_to_contact]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum study_to_contactField {
  id
  studyDbId
  contactDbId
}

input searchStudy_to_contactInput {
  field: study_to_contactField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchStudy_to_contactInput]
}

input orderStudy_to_contactInput{
  field: study_to_contactField
  order: Order
}

type Query {
  readOneStudy_to_contact(id: ID!): study_to_contact
  countStudy_to_contacts(search: searchStudy_to_contactInput ): Int
  vueTableStudy_to_contact : VueTableStudy_to_contact  csvTableTemplateStudy_to_contact: [String]

  study_to_contactsConnection(search:searchStudy_to_contactInput, order: [ orderStudy_to_contactInput ], pagination: paginationCursorInput ): Study_to_contactConnection
}

  type Mutation {
  addStudy_to_contact(  , addStudy:ID, addContact:ID , skipAssociationsExistenceChecks:Boolean = false): study_to_contact!
  updateStudy_to_contact(id: ID!,  , addStudy:ID, removeStudy:ID , addContact:ID, removeContact:ID  , skipAssociationsExistenceChecks:Boolean = false): study_to_contact!
deleteStudy_to_contact(id: ID!): String!
bulkAddStudy_to_contactCsv: [study_to_contact] }

`;