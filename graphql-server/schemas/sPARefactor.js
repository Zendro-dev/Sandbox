module.exports = `
  type SPARefactor{
    """
    @original-field
    """
    int: ID
    """
    @original-field
    
    """
    array: [Boolean]

    """
    @original-field
    
    """
    string: String

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
    int
    array
    string
    float
    date
    time
    datetime
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
    readOneSPARefactor(int: ID!): SPARefactor
    countSPARefactors(search: searchSPARefactorInput ): Int
    vueTableSPARefactor : VueTableSPARefactor    csvTableTemplateSPARefactor: [String]
    sPARefactorsConnection(search:searchSPARefactorInput, order: [ orderSPARefactorInput ], pagination: paginationCursorInput! ): SPARefactorConnection
  }

  type Mutation {
    addSPARefactor(int: ID!, array: [Boolean], string: String, float: Float, date: Date, time: Time, datetime: DateTime    , skipAssociationsExistenceChecks:Boolean = false): SPARefactor!
    updateSPARefactor(int: ID!, array: [Boolean], string: String, float: Float, date: Date, time: Time, datetime: DateTime    , skipAssociationsExistenceChecks:Boolean = false): SPARefactor!
    deleteSPARefactor(int: ID!): String!
    bulkAddSPARefactorCsv: String!
      }
`;