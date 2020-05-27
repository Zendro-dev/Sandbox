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

    unique_country(search: searchCountryInput): country
    }

type CapitalConnection{
  edges: [CapitalEdge]
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
    value: typeValue
    operator: Operator
    search: [searchCapitalInput]
  }

  input orderCapitalInput{
    field: capitalField
    order: Order
  }

  type Query {
    capitals(search: searchCapitalInput, order: [ orderCapitalInput ], pagination: paginationInput ): [capital]
    readOneCapital(capital_id: ID!): capital
    countCapitals(search: searchCapitalInput ): Int
    vueTableCapital : VueTableCapital    csvTableTemplateCapital: [String]

    capitalsConnection(search:searchCapitalInput, order: [ orderCapitalInput ], pagination: paginationCursorInput ): CapitalConnection
  }

    type Mutation {
    addCapital(capital_id: ID!, name: String , addUnique_country:ID , skipAssociationsExistenceChecks:Boolean = false): capital!
    updateCapital(capital_id: ID!, name: String , addUnique_country:ID, removeUnique_country:ID  , skipAssociationsExistenceChecks:Boolean = false): capital!
  deleteCapital(capital_id: ID!): String!
  bulkAddCapitalCsv: [capital] }

`;