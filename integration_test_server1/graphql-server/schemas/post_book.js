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

      
    }
type Post_bookConnection{
  edges: [Post_bookEdge]
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
  }
  input searchPost_bookInput {
    field: post_bookField
    value: typeValue
    operator: Operator
    search: [searchPost_bookInput]
  }

  input orderPost_bookInput{
    field: post_bookField
    order: Order
  }



  type Query {
    post_books(search: searchPost_bookInput, order: [ orderPost_bookInput ], pagination: paginationInput ): [post_book]
    readOnePost_book(id: ID!): post_book
    countPost_books(search: searchPost_bookInput ): Int
    vueTablePost_book : VueTablePost_book    csvTableTemplatePost_book: [String]
    post_booksConnection(search:searchPost_bookInput, order: [ orderPost_bookInput ], pagination: paginationCursorInput ): Post_bookConnection
  }

  type Mutation {
    addPost_book(id: ID!, title: String, genre: String, ISBN: String    , skipAssociationsExistenceChecks:Boolean = false): post_book!
    updatePost_book(id: ID!, title: String, genre: String, ISBN: String    , skipAssociationsExistenceChecks:Boolean = false): post_book!
    deletePost_book(id: ID!): String!
    bulkAddPost_bookCsv: String!
      }
`;