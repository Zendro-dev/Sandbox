module.exports = `
  type alien{
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

      
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type AlienConnection{
  edges: [AlienEdge]
  aliens: [alien]
  pageInfo: pageInfo!
}

type AlienEdge{
  cursor: String!
  node: alien!
}

  type VueTableAlien{
    data : [alien]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum alienField {
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
  
  input searchAlienInput {
    field: alienField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchAlienInput]
  }

  input orderAlienInput{
    field: alienField
    order: Order
  }



  type Query {
    aliens(search: searchAlienInput, order: [ orderAlienInput ], pagination: paginationInput! ): [alien]
    readOneAlien(idField: ID!): alien
    countAliens(search: searchAlienInput ): Int
    vueTableAlien : VueTableAlien
    csvTableTemplateAlien: [String]
    aliensConnection(search:searchAlienInput, order: [ orderAlienInput ], pagination: paginationCursorInput! ): AlienConnection
    validateAlienForCreation(idField: ID!, stringField: String, intField: Int, floatField: Float, datetimeField: DateTime, booleanField: Boolean, stringArrayField: [String], intArrayField: [Int], floatArrayField: [Float], datetimeArrayField: [DateTime], booleanArrayField: [Boolean]    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateAlienForUpdating(idField: ID!, stringField: String, intField: Int, floatField: Float, datetimeField: DateTime, booleanField: Boolean, stringArrayField: [String], intArrayField: [Int], floatArrayField: [Float], datetimeArrayField: [DateTime], booleanArrayField: [Boolean]    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateAlienForDeletion(idField: ID!): Boolean!
    validateAlienAfterReading(idField: ID!): Boolean!
  }

  type Mutation {
    addAlien(idField: ID!, stringField: String, intField: Int, floatField: Float, datetimeField: DateTime, booleanField: Boolean, stringArrayField: [String], intArrayField: [Int], floatArrayField: [Float], datetimeArrayField: [DateTime], booleanArrayField: [Boolean]    , skipAssociationsExistenceChecks:Boolean = false): alien!
    updateAlien(idField: ID!, stringField: String, intField: Int, floatField: Float, datetimeField: DateTime, booleanField: Boolean, stringArrayField: [String], intArrayField: [Int], floatArrayField: [Float], datetimeArrayField: [DateTime], booleanArrayField: [Boolean]    , skipAssociationsExistenceChecks:Boolean = false): alien!
    deleteAlien(idField: ID!): String!
    bulkAddAlienCsv: String!
      }
`;