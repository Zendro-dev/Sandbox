module.exports = `
  type no_assoc{
    """
    @original-field
    """
    idField: ID
    """
    @original-field
    
    """
    stringField: String

    """
    @original-field
    
    """
    intField: Int

    """
    @original-field
    
    """
    floatField: Float

    """
    @original-field
    
    """
    datetimeField: DateTime

    """
    @original-field
    
    """
    booleanField: Boolean

    """
    @original-field
    
    """
    stringArrayField: [String]

    """
    @original-field
    
    """
    intArrayField: [Int]

    """
    @original-field
    
    """
    floatArrayField: [Float]

    """
    @original-field
    
    """
    datetimeArrayField: [DateTime]

    """
    @original-field
    
    """
    booleanArrayField: [Boolean]

      
    }
type No_assocConnection{
  edges: [No_assocEdge]
  pageInfo: pageInfo!
}

type No_assocEdge{
  cursor: String!
  node: no_assoc!
}

  type VueTableNo_assoc{
    data : [no_assoc]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum no_assocField {
    idField
    stringField
    intField
    floatField
    datetimeField
    booleanField
    stringArrayField
    intArrayField
    floatArrayField
    datetimeArrayField
    booleanArrayField
  }
  input searchNo_assocInput {
    field: no_assocField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchNo_assocInput]
  }

  input orderNo_assocInput{
    field: no_assocField
    order: Order
  }



  type Query {
    no_assocs(search: searchNo_assocInput, order: [ orderNo_assocInput ], pagination: paginationInput! ): [no_assoc]
    readOneNo_assoc(idField: ID!): no_assoc
    countNo_assocs(search: searchNo_assocInput ): Int
    vueTableNo_assoc : VueTableNo_assoc    csvTableTemplateNo_assoc: [String]
    no_assocsConnection(search:searchNo_assocInput, order: [ orderNo_assocInput ], pagination: paginationCursorInput! ): No_assocConnection
  }

  type Mutation {
    addNo_assoc(idField: ID!, stringField: String, intField: Int, floatField: Float, datetimeField: DateTime, booleanField: Boolean, stringArrayField: [String], intArrayField: [Int], floatArrayField: [Float], datetimeArrayField: [DateTime], booleanArrayField: [Boolean]    , skipAssociationsExistenceChecks:Boolean = false): no_assoc!
    updateNo_assoc(idField: ID!, stringField: String, intField: Int, floatField: Float, datetimeField: DateTime, booleanField: Boolean, stringArrayField: [String], intArrayField: [Int], floatArrayField: [Float], datetimeArrayField: [DateTime], booleanArrayField: [Boolean]    , skipAssociationsExistenceChecks:Boolean = false): no_assoc!
    deleteNo_assoc(idField: ID!): String!
    bulkAddNo_assocCsv: String!
      }
`;