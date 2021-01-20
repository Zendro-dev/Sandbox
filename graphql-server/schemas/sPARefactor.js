module.exports = `
  type SPARefactor{
    """
    @original-field
    """
    string: ID
    """
    @original-field
    
    """
    array: [String]

    """
    @original-field
    
    """
    int: Int

    """
    @original-field
    
    """
    float: Float

    """
    @original-field
    
    """
    date: Date

    """
    @original-field
    
    """
    time: Time

    """
    @original-field
    
    """
    datetime: DateTime

    """
    @original-field
    
    """
    boolean: Boolean

      
    }
type SPARefactorConnection{
  edges: [SPARefactorEdge]
  pageInfo: pageInfo!
}

type SPARefactorEdge{
  cursor: String!
  node: SPARefactor!
}

  type VueTableSPARefactor{
    data : [SPARefactor]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum SPARefactorField {
    string
    array
    int
    float
    date
    time
    datetime
    boolean
  }
  input searchSPARefactorInput {
    field: SPARefactorField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchSPARefactorInput]
  }

  input orderSPARefactorInput{
    field: SPARefactorField
    order: Order
  }



  type Query {
    sPARefactors(search: searchSPARefactorInput, order: [ orderSPARefactorInput ], pagination: paginationInput! ): [SPARefactor]
    readOneSPARefactor(string: ID!): SPARefactor
    countSPARefactors(search: searchSPARefactorInput ): Int
    vueTableSPARefactor : VueTableSPARefactor    csvTableTemplateSPARefactor: [String]
    sPARefactorsConnection(search:searchSPARefactorInput, order: [ orderSPARefactorInput ], pagination: paginationCursorInput! ): SPARefactorConnection
  }

  type Mutation {
    addSPARefactor(string: ID!, array: [String], int: Int, float: Float, date: Date, time: Time, datetime: DateTime, boolean: Boolean    , skipAssociationsExistenceChecks:Boolean = false): SPARefactor!
    updateSPARefactor(string: ID!, array: [String], int: Int, float: Float, date: Date, time: Time, datetime: DateTime, boolean: Boolean    , skipAssociationsExistenceChecks:Boolean = false): SPARefactor!
    deleteSPARefactor(string: ID!): String!
    bulkAddSPARefactorCsv: String!
      }
`;