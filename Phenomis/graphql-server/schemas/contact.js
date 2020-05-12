module.exports = `
type contact{
  """
  @original-field
  """
  contactDbId: ID

"""
  @original-field
  
  """
  email: String

"""
  @original-field
  
  """
  instituteName: String

"""
  @original-field
  
  """
  name: String

"""
  @original-field
  
  """
  orcid: String

"""
  @original-field
  
  """
  type: String


  """
  @search-request
  """
  ContactTostudiesConnection(search: searchStudy_to_contactInput, order: [ orderStudy_to_contactInput ], pagination: paginationCursorInput): Study_to_contactConnection

  """
  @count-request
  """
  countFilteredContactTostudies(search: searchStudy_to_contactInput) : Int

  """
  @search-request
  """
  ContactToTrialsConnection(search: searchTrial_to_contactInput, order: [ orderTrial_to_contactInput ], pagination: paginationCursorInput): Trial_to_contactConnection

  """
  @count-request
  """
  countFilteredContactToTrials(search: searchTrial_to_contactInput) : Int
}

type ContactConnection{
edges: [ContactEdge]
pageInfo: pageInfo!
}

type ContactEdge{
cursor: String!
node: contact!
}

type VueTableContact{
  data : [contact]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum contactField {
  contactDbId
  email
  instituteName
  name
  orcid
  type
}

input searchContactInput {
  field: contactField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchContactInput]
}

input orderContactInput{
  field: contactField
  order: Order
}

type Query {
  readOneContact(contactDbId: ID!): contact
  countContacts(search: searchContactInput ): Int
  vueTableContact : VueTableContact  csvTableTemplateContact: [String]

  contactsConnection(search:searchContactInput, order: [ orderContactInput ], pagination: paginationCursorInput ): ContactConnection
}

  type Mutation {
  addContact(contactDbId: ID!, email: String, instituteName: String, name: String, orcid: String, type: String  , addContactTostudies:[ID], addContactToTrials:[ID], skipAssociationsExistenceChecks:Boolean = false): contact!
  updateContact(contactDbId: ID!, email: String, instituteName: String, name: String, orcid: String, type: String  , addContactTostudies:[ID], removeContactTostudies:[ID] , addContactToTrials:[ID], removeContactToTrials:[ID] , skipAssociationsExistenceChecks:Boolean = false): contact!
deleteContact(contactDbId: ID!): String!
bulkAddContactCsv: [contact] }

`;