module.exports = `
  type post_author{
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
    book_ids: [String]

      
    """
    @search-request
    """
    booksFilter(search: searchPost_bookInput, order: [ orderPost_bookInput ], pagination: paginationInput!): [post_book]


    """
    @search-request
    """
    booksConnection(search: searchPost_bookInput, order: [ orderPost_bookInput ], pagination: paginationCursorInput!): Post_bookConnection

    """
    @count-request
    """
    countFilteredBooks(search: searchPost_bookInput) : Int
  
    }
type Post_authorConnection{
  edges: [Post_authorEdge]
  pageInfo: pageInfo!
}

type Post_authorEdge{
  cursor: String!
  node: post_author!
}

  type VueTablePost_author{
    data : [post_author]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum post_authorField {
    id
    name
    lastname
    email
    book_ids
  }
  input searchPost_authorInput {
    field: post_authorField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchPost_authorInput]
  }

  input orderPost_authorInput{
    field: post_authorField
    order: Order
  }



  type Query {
    post_authors(search: searchPost_authorInput, order: [ orderPost_authorInput ], pagination: paginationInput! ): [post_author]
    readOnePost_author(id: ID!): post_author
    countPost_authors(search: searchPost_authorInput ): Int
    vueTablePost_author : VueTablePost_author    csvTableTemplatePost_author: [String]
    post_authorsConnection(search:searchPost_authorInput, order: [ orderPost_authorInput ], pagination: paginationCursorInput! ): Post_authorConnection
  }

  type Mutation {
    addPost_author(id: ID!, name: String, lastname: String, email: String   , addBooks:[ID] , skipAssociationsExistenceChecks:Boolean = false): post_author!
    updatePost_author(id: ID!, name: String, lastname: String, email: String   , addBooks:[ID], removeBooks:[ID]  , skipAssociationsExistenceChecks:Boolean = false): post_author!
    deletePost_author(id: ID!): String!
    bulkAddPost_authorCsv: String!
      }
`;