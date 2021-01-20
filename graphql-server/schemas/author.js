module.exports = `
  type author{
    """
    @original-field
    """
    author_id: ID
    """
    @original-field
    
    """
    name: String

      
    """
    @search-request
    """
    booksFilter(search: searchBookInput, order: [ orderBookInput ], pagination: paginationInput!): [book]


    """
    @search-request
    """
    booksConnection(search: searchBookInput, order: [ orderBookInput ], pagination: paginationCursorInput!): BookConnection

    """
    @count-request
    """
    countFilteredBooks(search: searchBookInput) : Int
  
    }
type AuthorConnection{
  edges: [AuthorEdge]
  pageInfo: pageInfo!
}

type AuthorEdge{
  cursor: String!
  node: author!
}

  type VueTableAuthor{
    data : [author]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum authorField {
    author_id
    name
  }
  input searchAuthorInput {
    field: authorField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchAuthorInput]
  }

  input orderAuthorInput{
    field: authorField
    order: Order
  }



  type Query {
    authors(search: searchAuthorInput, order: [ orderAuthorInput ], pagination: paginationInput! ): [author]
    readOneAuthor(author_id: ID!): author
    countAuthors(search: searchAuthorInput ): Int
    vueTableAuthor : VueTableAuthor    csvTableTemplateAuthor: [String]
    authorsConnection(search:searchAuthorInput, order: [ orderAuthorInput ], pagination: paginationCursorInput! ): AuthorConnection
  }

  type Mutation {
    addAuthor(author_id: ID!, name: String   , addBooks:[ID] , skipAssociationsExistenceChecks:Boolean = false): author!
    updateAuthor(author_id: ID!, name: String   , addBooks:[ID], removeBooks:[ID]  , skipAssociationsExistenceChecks:Boolean = false): author!
    deleteAuthor(author_id: ID!): String!
    bulkAddAuthorCsv: String!
      }
`;