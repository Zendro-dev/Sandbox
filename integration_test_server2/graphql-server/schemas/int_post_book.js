module.exports = `
  type int_post_book{
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
    author_ids: [Int]

      
    """
    @search-request
    """
    authorsFilter(search: searchInt_post_authorInput, order: [ orderInt_post_authorInput ], pagination: paginationInput!): [int_post_author]


    """
    @search-request
    """
    authorsConnection(search: searchInt_post_authorInput, order: [ orderInt_post_authorInput ], pagination: paginationCursorInput!): Int_post_authorConnection

    """
    @count-request
    """
    countFilteredAuthors(search: searchInt_post_authorInput) : Int
  
    }
type Int_post_bookConnection{
  edges: [Int_post_bookEdge]
  int_post_books: [int_post_book]
  pageInfo: pageInfo!
}

type Int_post_bookEdge{
  cursor: String!
  node: int_post_book!
}

  type VueTableInt_post_book{
    data : [int_post_book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum int_post_bookField {
    id
    title
    genre
    ISBN
    author_ids
  }
  input searchInt_post_bookInput {
    field: int_post_bookField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchInt_post_bookInput]
  }

  input orderInt_post_bookInput{
    field: int_post_bookField
    order: Order
  }



  type Query {
    int_post_books(search: searchInt_post_bookInput, order: [ orderInt_post_bookInput ], pagination: paginationInput! ): [int_post_book]
    readOneInt_post_book(id: ID!): int_post_book
    countInt_post_books(search: searchInt_post_bookInput ): Int
    vueTableInt_post_book : VueTableInt_post_book    csvTableTemplateInt_post_book: [String]
    int_post_booksConnection(search:searchInt_post_bookInput, order: [ orderInt_post_bookInput ], pagination: paginationCursorInput! ): Int_post_bookConnection
  }

  type Mutation {
    addInt_post_book(id: ID!, title: String, genre: String, ISBN: String   , addAuthors:[ID] , skipAssociationsExistenceChecks:Boolean = false): int_post_book!
    updateInt_post_book(id: ID!, title: String, genre: String, ISBN: String   , addAuthors:[ID], removeAuthors:[ID]  , skipAssociationsExistenceChecks:Boolean = false): int_post_book!
    deleteInt_post_book(id: ID!): String!
    bulkAddInt_post_bookCsv: String!
      }
`;