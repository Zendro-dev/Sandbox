module.exports = `
  type snpmatrix{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    snp_matrix_id: Int

    """
    @original-field
    
    """
    int_array: [Int]

      
    """
    @search-request
    """
    snplocusFilter(search: searchSnplocusInput, order: [ orderSnplocusInput ], pagination: paginationInput!): [snplocus]


    """
    @search-request
    """
    snplocusConnection(search: searchSnplocusInput, order: [ orderSnplocusInput ], pagination: paginationCursorInput!): SnplocusConnection

    """
    @count-request
    """
    countFilteredSnplocus(search: searchSnplocusInput) : Int
  
    """
    @search-request
    """
    snpgenotypeFilter(search: searchSnpgenotypeInput, order: [ orderSnpgenotypeInput ], pagination: paginationInput!): [snpgenotype]


    """
    @search-request
    """
    snpgenotypeConnection(search: searchSnpgenotypeInput, order: [ orderSnpgenotypeInput ], pagination: paginationCursorInput!): SnpgenotypeConnection

    """
    @count-request
    """
    countFilteredSnpgenotype(search: searchSnpgenotypeInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type SnpmatrixConnection{
  edges: [SnpmatrixEdge]
  snpmatrices: [snpmatrix]
  pageInfo: pageInfo!
}

type SnpmatrixEdge{
  cursor: String!
  node: snpmatrix!
}

  enum snpmatrixField {
    id
    snp_matrix_id
    int_array
  }
  
  input searchSnpmatrixInput {
    field: snpmatrixField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchSnpmatrixInput]
  }

  input orderSnpmatrixInput{
    field: snpmatrixField
    order: Order
  }



  type Query {
    snpmatrices(search: searchSnpmatrixInput, order: [ orderSnpmatrixInput ], pagination: paginationInput! ): [snpmatrix]
    readOneSnpmatrix(id: ID!): snpmatrix
    countSnpmatrices(search: searchSnpmatrixInput ): Int
    csvTableTemplateSnpmatrix: [String]
    snpmatricesConnection(search:searchSnpmatrixInput, order: [ orderSnpmatrixInput ], pagination: paginationCursorInput! ): SnpmatrixConnection
    validateSnpmatrixForCreation( snp_matrix_id: Int, int_array: [Int]   , addSnplocus:[ID], addSnpgenotype:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateSnpmatrixForUpdating(id: ID!, snp_matrix_id: Int, int_array: [Int]   , addSnplocus:[ID], removeSnplocus:[ID] , addSnpgenotype:[ID], removeSnpgenotype:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateSnpmatrixForDeletion(id: ID!): Boolean!
    validateSnpmatrixAfterReading(id: ID!): Boolean!
    """
    snpmatricesZendroDefinition would return the static Zendro data model definition
    """
    snpmatricesZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addSnpmatrix( snp_matrix_id: Int, int_array: [Int]   , addSnplocus:[ID], addSnpgenotype:[ID] , skipAssociationsExistenceChecks:Boolean = false): snpmatrix!
    updateSnpmatrix(id: ID!, snp_matrix_id: Int, int_array: [Int]   , addSnplocus:[ID], removeSnplocus:[ID] , addSnpgenotype:[ID], removeSnpgenotype:[ID]  , skipAssociationsExistenceChecks:Boolean = false): snpmatrix!
    deleteSnpmatrix(id: ID!): String!
      }
`;