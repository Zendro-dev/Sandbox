module.exports = `
  type sq_author{
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
    lastname: String

    """
    @original-field

    """
    email: String

    book_ids: [ String ]
    }
type Sq_authorConnection{
  edges: [Sq_authorEdge]
  pageInfo: pageInfo!
}

type Sq_authorEdge{
  cursor: String!
  node: sq_author!
}

  type VueTableSq_author{
    data : [sq_author]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum sq_authorField {
    id
    name
    lastname
    email
    book_ids
  }
  input searchSq_authorInput {
    field: sq_authorField
    value: typeValue
    operator: Operator
    search: [searchSq_authorInput]
  }

  input orderSq_authorInput{
    field: sq_authorField
    order: Order
  }



  type Query {
    sq_authors(search: searchSq_authorInput, order: [ orderSq_authorInput ], pagination: paginationInput ): [sq_author]
    readOneSq_author(id: ID!): sq_author
    countSq_authors(search: searchSq_authorInput ): Int
    vueTableSq_author : VueTableSq_author    csvTableTemplateSq_author: [String]
    sq_authorsConnection(search:searchSq_authorInput, order: [ orderSq_authorInput ], pagination: paginationCursorInput ): Sq_authorConnection
  }

  type Mutation {
    addSq_author(id: ID!, name: String, lastname: String, email: String,  book_ids: [String]    , skipAssociationsExistenceChecks:Boolean = false): sq_author!
    updateSq_author(id: ID!, name: String, lastname: String, email: String    , skipAssociationsExistenceChecks:Boolean = false): sq_author!
    deleteSq_author(id: ID!): String!
    bulkAddSq_authorCsv: String!
      }
`;
