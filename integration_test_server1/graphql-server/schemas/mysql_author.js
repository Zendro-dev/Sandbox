module.exports = `
  type mysql_author{
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

      
    }
type Mysql_authorConnection{
  edges: [Mysql_authorEdge]
  pageInfo: pageInfo!
}

type Mysql_authorEdge{
  cursor: String!
  node: mysql_author!
}

  type VueTableMysql_author{
    data : [mysql_author]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum mysql_authorField {
    id
    name
    lastname
    email
  }
  input searchMysql_authorInput {
    field: mysql_authorField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchMysql_authorInput]
  }

  input orderMysql_authorInput{
    field: mysql_authorField
    order: Order
  }



  type Query {
    mysql_authors(search: searchMysql_authorInput, order: [ orderMysql_authorInput ], pagination: paginationInput ): [mysql_author]
    readOneMysql_author(id: ID!): mysql_author
    countMysql_authors(search: searchMysql_authorInput ): Int
    vueTableMysql_author : VueTableMysql_author    csvTableTemplateMysql_author: [String]
    mysql_authorsConnection(search:searchMysql_authorInput, order: [ orderMysql_authorInput ], pagination: paginationCursorInput ): Mysql_authorConnection
  }

  type Mutation {
    addMysql_author(id: ID!, name: String, lastname: String, email: String    , skipAssociationsExistenceChecks:Boolean = false): mysql_author!
    updateMysql_author(id: ID!, name: String, lastname: String, email: String    , skipAssociationsExistenceChecks:Boolean = false): mysql_author!
    deleteMysql_author(id: ID!): String!
    bulkAddMysql_authorCsv: String!
      }
`;