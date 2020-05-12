module.exports = `
type trial_to_contact{
  """
  @original-field
  """
  id: ID

"""
  @original-field
  
  """
  trialDbId: String

"""
  @original-field
  
  """
  contactDbId: String

trial(search: searchTrialInput): trial
contact(search: searchContactInput): contact
}

type Trial_to_contactConnection{
edges: [Trial_to_contactEdge]
pageInfo: pageInfo!
}

type Trial_to_contactEdge{
cursor: String!
node: trial_to_contact!
}

type VueTableTrial_to_contact{
  data : [trial_to_contact]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum trial_to_contactField {
  id
  trialDbId
  contactDbId
}

input searchTrial_to_contactInput {
  field: trial_to_contactField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchTrial_to_contactInput]
}

input orderTrial_to_contactInput{
  field: trial_to_contactField
  order: Order
}

type Query {
  readOneTrial_to_contact(id: ID!): trial_to_contact
  countTrial_to_contacts(search: searchTrial_to_contactInput ): Int
  vueTableTrial_to_contact : VueTableTrial_to_contact  csvTableTemplateTrial_to_contact: [String]

  trial_to_contactsConnection(search:searchTrial_to_contactInput, order: [ orderTrial_to_contactInput ], pagination: paginationCursorInput ): Trial_to_contactConnection
}

  type Mutation {
  addTrial_to_contact(  , addTrial:ID, addContact:ID , skipAssociationsExistenceChecks:Boolean = false): trial_to_contact!
  updateTrial_to_contact(id: ID!,  , addTrial:ID, removeTrial:ID , addContact:ID, removeContact:ID  , skipAssociationsExistenceChecks:Boolean = false): trial_to_contact!
deleteTrial_to_contact(id: ID!): String!
bulkAddTrial_to_contactCsv: [trial_to_contact] }

`;