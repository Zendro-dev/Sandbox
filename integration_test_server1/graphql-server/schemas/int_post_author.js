module.exports = `
  type int_post_author{
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

    """
    @original-field

    """
    book_ids: [Int]


    """
    @search-request
    """
    booksFilter(search: searchInt_post_bookInput, order: [ orderInt_post_bookInput ], pagination: paginationInput!): [int_post_book]


    """
    @search-request
    """
    booksConnection(search: searchInt_post_bookInput, order: [ orderInt_post_bookInput ], pagination: paginationCursorInput!): Int_post_bookConnection

    """
    @count-request
    """
    countFilteredBooks(search: searchInt_post_bookInput) : Int

    }
type Int_post_authorConnection{
  edges: [Int_post_authorEdge]
  authors: [int_post_author]
  pageInfo: pageInfo!
}

type Int_post_authorEdge{
  cursor: String!
  node: int_post_author!
}

  type VueTableInt_post_author{
    data : [int_post_author]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum int_post_authorField {
    id
    name
    lastname
    email
    book_ids
  }
  input searchInt_post_authorInput {
    field: int_post_authorField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchInt_post_authorInput]
  }

  input orderInt_post_authorInput{
    field: int_post_authorField
    order: Order
  }



  type Query {
    int_post_authors(search: searchInt_post_authorInput, order: [ orderInt_post_authorInput ], pagination: paginationInput! ): [int_post_author]
    readOneInt_post_author(id: ID!): int_post_author
    countInt_post_authors(search: searchInt_post_authorInput ): Int
    vueTableInt_post_author : VueTableInt_post_author    csvTableTemplateInt_post_author: [String]
    int_post_authorsConnection(search:searchInt_post_authorInput, order: [ orderInt_post_authorInput ], pagination: paginationCursorInput! ): Int_post_authorConnection
  }

  type Mutation {
    addInt_post_author(id: ID!, name: String, lastname: String, email: String   , addBooks:[ID] , skipAssociationsExistenceChecks:Boolean = false): int_post_author!
    updateInt_post_author(id: ID!, name: String, lastname: String, email: String   , addBooks:[ID], removeBooks:[ID]  , skipAssociationsExistenceChecks:Boolean = false): int_post_author!
    deleteInt_post_author(id: ID!): String!
    bulkAddInt_post_authorCsv: String!
      }
`;
