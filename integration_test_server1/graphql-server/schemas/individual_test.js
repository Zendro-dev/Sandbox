module.exports = `
  type individual_test{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    name: String

      
    }
type Individual_testConnection{
  edges: [Individual_testEdge]
  pageInfo: pageInfo!
}

type Individual_testEdge{
  cursor: String!
  node: individual_test!
}

  type VueTableIndividual_test{
    data : [individual_test]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum individual_testField {
    id
    name
  }
  input searchIndividual_testInput {
    field: individual_testField
    value: typeValue
    operator: Operator
    search: [searchIndividual_testInput]
  }

  input orderIndividual_testInput{
    field: individual_testField
    order: Order
  }



  type Query {
    individual_tests(search: searchIndividual_testInput, order: [ orderIndividual_testInput ], pagination: paginationInput ): [individual_test]
    readOneIndividual_test(id: ID!): individual_test
    countIndividual_tests(search: searchIndividual_testInput ): Int
    vueTableIndividual_test : VueTableIndividual_test    csvTableTemplateIndividual_test: [String]
    individual_testsConnection(search:searchIndividual_testInput, order: [ orderIndividual_testInput ], pagination: paginationCursorInput ): Individual_testConnection
  }

  type Mutation {
    addIndividual_test( name: String    , skipAssociationsExistenceChecks:Boolean = false): individual_test!
    updateIndividual_test(id: ID!, name: String    , skipAssociationsExistenceChecks:Boolean = false): individual_test!
    deleteIndividual_test(id: ID!): String!
    bulkAddIndividual_testCsv: String!
      }
`;