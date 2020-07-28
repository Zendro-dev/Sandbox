module.exports = `
  type AllTypes{
    """
    @original-field
    """
    record_id: ID
    """
    @original-field
    
    """
    record_date: Date

    """
    @original-field
    
    """
    record_date_time: DateTime

    """
    @original-field
    
    """
    record_time: Time

    """
    @original-field
    
    """
    record_int: Int

    """
    @original-field
    
    """
    record_boolean: Boolean

    """
    @original-field
    
    """
    record_float: Float

    """
    @original-field
    
    """
    record_string: String

      
    }
type AllTypesConnection{
  edges: [AllTypesEdge]
  pageInfo: pageInfo!
}

type AllTypesEdge{
  cursor: String!
  node: AllTypes!
}

  type VueTableAllTypes{
    data : [AllTypes]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum AllTypesField {
    record_id
    record_date
    record_date_time
    record_time
    record_int
    record_boolean
    record_float
    record_string
  }
  input searchAllTypesInput {
    field: AllTypesField
    value: typeValue
    operator: Operator
    search: [searchAllTypesInput]
  }

  input orderAllTypesInput{
    field: AllTypesField
    order: Order
  }
  type Query {
    allTypes(search: searchAllTypesInput, order: [ orderAllTypesInput ], pagination: paginationInput ): [AllTypes]
    readOneAllTypes(record_id: ID!): AllTypes
    countAllTypes(search: searchAllTypesInput ): Int
    vueTableAllTypes : VueTableAllTypes    csvTableTemplateAllTypes: [String]

    allTypesConnection(search:searchAllTypesInput, order: [ orderAllTypesInput ], pagination: paginationCursorInput ): AllTypesConnection
  }
    type Mutation {
    addAllTypes(record_id: ID!, record_date: Date, record_date_time: DateTime, record_time: Time, record_int: Int, record_boolean: Boolean, record_float: Float, record_string: String    , skipAssociationsExistenceChecks:Boolean = false): AllTypes!
    updateAllTypes(record_id: ID!, record_date: Date, record_date_time: DateTime, record_time: Time, record_int: Int, record_boolean: Boolean, record_float: Float, record_string: String    , skipAssociationsExistenceChecks:Boolean = false): AllTypes!
  deleteAllTypes(record_id: ID!): String!
  bulkAddAllTypesCsv: String! }

`;