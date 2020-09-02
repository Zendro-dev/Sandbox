module.exports = `
  type mariadb_author{
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
type Mariadb_authorConnection{
  edges: [Mariadb_authorEdge]
  pageInfo: pageInfo!
}

type Mariadb_authorEdge{
  cursor: String!
  node: mariadb_author!
}

  type VueTableMariadb_author{
    data : [mariadb_author]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum mariadb_authorField {
    id
    name
    lastname
    email
    book_ids
  }
  input searchMariadb_authorInput {
    field: mariadb_authorField
    value: typeValue
    operator: Operator
    search: [searchMariadb_authorInput]
  }

  input orderMariadb_authorInput{
    field: mariadb_authorField
    order: Order
  }



  type Query {
    mariadb_authors(search: searchMariadb_authorInput, order: [ orderMariadb_authorInput ], pagination: paginationInput ): [mariadb_author]
    readOneMariadb_author(id: ID!): mariadb_author
    countMariadb_authors(search: searchMariadb_authorInput ): Int
    vueTableMariadb_author : VueTableMariadb_author    csvTableTemplateMariadb_author: [String]
    mariadb_authorsConnection(search:searchMariadb_authorInput, order: [ orderMariadb_authorInput ], pagination: paginationCursorInput ): Mariadb_authorConnection
  }

  type Mutation {
    addMariadb_author(id: ID!, name: String, lastname: String, email: String,  book_ids: [String]  , skipAssociationsExistenceChecks:Boolean = false): mariadb_author!
    updateMariadb_author(id: ID!, name: String, lastname: String, email: String    , skipAssociationsExistenceChecks:Boolean = false): mariadb_author!
    deleteMariadb_author(id: ID!): String!
    bulkAddMariadb_authorCsv: String!
      }
`;
