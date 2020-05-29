module.exports = `
type parrot{
  """
  @original-field
  """
  parrot_id: ID

  """
  @original-field
  
  """
  name: String
"""
  @original-field
  
  """
  person_id: String

unique_person(search: searchPersonInput): person

}

type ParrotConnection{
edges: [ParrotEdge]
pageInfo: pageInfo!
}

type ParrotEdge{
cursor: String!
node: parrot!
}

type VueTableParrot{
  data : [parrot]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum parrotField {
  parrot_id
  name
  person_id
}

input searchParrotInput {
  field: parrotField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchParrotInput]
}

input orderParrotInput{
  field: parrotField
  order: Order
}

type Query {
  readOneParrot(parrot_id: ID!): parrot
  countParrots(search: searchParrotInput ): Int
  vueTableParrot : VueTableParrot  csvTableTemplateParrot: [String]

  parrotsConnection(search:searchParrotInput, order: [ orderParrotInput ], pagination: paginationCursorInput ): ParrotConnection
}

  type Mutation {
  addParrot(parrot_id: ID!, name: String , addUnique_person:ID   , skipAssociationsExistenceChecks:Boolean = false): parrot!
  updateParrot(parrot_id: ID!, name: String , addUnique_person:ID, removeUnique_person:ID    , skipAssociationsExistenceChecks:Boolean = false): parrot!
deleteParrot(parrot_id: ID!): String!
bulkAddParrotCsv: [parrot] }

`;