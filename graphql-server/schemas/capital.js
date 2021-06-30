module.exports = `
type capital{
  """
  @original-field
  """
  capital_id: ID

  """
  @original-field
  
  """
  name: String
"""
  @original-field
  
  """
  country_id: String


country(search: searchCountryInput): country

}

type CapitalConnection{
edges: [CapitalEdge]
capitals: [capital]
pageInfo: pageInfo!
}

type CapitalEdge{
cursor: String!
node: capital!
}

type VueTableCapital{
  data : [capital]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum capitalField {
  capital_id
  name
  country_id

}

input searchCapitalInput {
  field: capitalField
  value: String
  valueType: InputType
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchCapitalInput]
}

input orderCapitalInput{
  field: capitalField
  order: Order
}

input bulkAssociationCapitalWithCountry_idInput{
  capital_id: ID!
  country_id: ID!
}

type Query {
  readOneCapital(capital_id: ID!): capital
  countCapitals(search: searchCapitalInput ): Int
  vueTableCapital : VueTableCapital  csvTableTemplateCapital: [String]
  capitalsConnection(search:searchCapitalInput, order: [ orderCapitalInput ], pagination: paginationCursorInput!): CapitalConnection
}

type Mutation {
  addCapital(capital_id: ID!, name: String , addCountry:ID   , skipAssociationsExistenceChecks:Boolean = false): capital!
  updateCapital(capital_id: ID!, name: String , addCountry:ID, removeCountry:ID    , skipAssociationsExistenceChecks:Boolean = false): capital!
  deleteCapital(capital_id: ID!): String!
  bulkAddCapitalCsv: String
  bulkAssociateCapitalWithCountry_id(bulkAssociationInput: [bulkAssociationCapitalWithCountry_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  bulkDisAssociateCapitalWithCountry_id(bulkAssociationInput: [bulkAssociationCapitalWithCountry_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
}
`;