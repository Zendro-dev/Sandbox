module.exports = `
  type post_book{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    title: String

    """
    @original-field
    
    """
    genre: String

    """
    @original-field
    
    """
    ISBN: String

    """
    @original-field
    
    """
    author_ids: [String]

      
    """
    @search-request
    """
    authorsFilter(search: searchPost_authorInput, order: [ orderPost_authorInput ], pagination: paginationInput!): [post_author]


    """
    @search-request
    """
    authorsConnection(search: searchPost_authorInput, order: [ orderPost_authorInput ], pagination: paginationCursorInput!): Post_authorConnection

    """
    @count-request
    """
    countFilteredAuthors(search: searchPost_authorInput) : Int
  
    }
type Post_bookConnection{
  edges: [Post_bookEdge]
  post_books: [post_book]
  pageInfo: pageInfo!
}

type Post_bookEdge{
  cursor: String!
  node: post_book!
}

  type VueTablePost_book{
    data : [post_book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum post_bookField {
    id
    title
    genre
    ISBN
    author_ids
  }
  input searchPost_bookInput {
    field: post_bookField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchPost_bookInput]
  }

  input orderPost_bookInput{
    field: post_bookField
    order: Order
  }



  type Query {
    post_books(search: searchPost_bookInput, order: [ orderPost_bookInput ], pagination: paginationInput! ): [post_book]
    readOnePost_book(id: ID!): post_book
    countPost_books(search: searchPost_bookInput ): Int
    vueTablePost_book : VueTablePost_book    csvTableTemplatePost_book: [String]
    post_booksConnection(search:searchPost_bookInput, order: [ orderPost_bookInput ], pagination: paginationCursorInput! ): Post_bookConnection
  }

  type Mutation {
    addPost_book(id: ID!, title: String, genre: String, ISBN: String   , addAuthors:[ID] , skipAssociationsExistenceChecks:Boolean = false): post_book!
    updatePost_book(id: ID!, title: String, genre: String, ISBN: String   , addAuthors:[ID], removeAuthors:[ID]  , skipAssociationsExistenceChecks:Boolean = false): post_book!
    deletePost_book(id: ID!): String!
    bulkAddPost_bookCsv: String!
      }
`;