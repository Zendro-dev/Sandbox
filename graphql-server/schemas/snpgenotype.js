module.exports = `
  type snpgenotype{
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
    material_id: String

    """
    @original-field
    
    """
    row_number: Int

    snpmatrix(search: searchSnpmatrixInput): snpmatrix
    
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type SnpgenotypeConnection{
  edges: [SnpgenotypeEdge]
  snpgenotypes: [snpgenotype]
  pageInfo: pageInfo!
}

type SnpgenotypeEdge{
  cursor: String!
  node: snpgenotype!
}

  enum snpgenotypeField {
    id
    snp_matrix_id
    material_id
    row_number
  }
  
  input searchSnpgenotypeInput {
    field: snpgenotypeField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchSnpgenotypeInput]
  }

  input orderSnpgenotypeInput{
    field: snpgenotypeField
    order: Order
  }

  input bulkAssociationSnpgenotypeWithSnp_matrix_idInput{
    id: ID!
    snp_matrix_id: ID!
  }

  type Query {
    snpgenotypes(search: searchSnpgenotypeInput, order: [ orderSnpgenotypeInput ], pagination: paginationInput! ): [snpgenotype]
    readOneSnpgenotype(id: ID!): snpgenotype
    countSnpgenotypes(search: searchSnpgenotypeInput ): Int
    csvTableTemplateSnpgenotype: [String]
    snpgenotypesConnection(search:searchSnpgenotypeInput, order: [ orderSnpgenotypeInput ], pagination: paginationCursorInput! ): SnpgenotypeConnection
    validateSnpgenotypeForCreation( material_id: String, row_number: Int , addSnpmatrix:ID   , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateSnpgenotypeForUpdating(id: ID!, material_id: String, row_number: Int , addSnpmatrix:ID, removeSnpmatrix:ID    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateSnpgenotypeForDeletion(id: ID!): Boolean!
    validateSnpgenotypeAfterReading(id: ID!): Boolean!
    """
    snpgenotypesZendroDefinition would return the static Zendro data model definition
    """
    snpgenotypesZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addSnpgenotype( material_id: String, row_number: Int , addSnpmatrix:ID   , skipAssociationsExistenceChecks:Boolean = false): snpgenotype!
    updateSnpgenotype(id: ID!, material_id: String, row_number: Int , addSnpmatrix:ID, removeSnpmatrix:ID    , skipAssociationsExistenceChecks:Boolean = false): snpgenotype!
    deleteSnpgenotype(id: ID!): String!
        bulkAssociateSnpgenotypeWithSnp_matrix_id(bulkAssociationInput: [bulkAssociationSnpgenotypeWithSnp_matrix_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateSnpgenotypeWithSnp_matrix_id(bulkAssociationInput: [bulkAssociationSnpgenotypeWithSnp_matrix_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;