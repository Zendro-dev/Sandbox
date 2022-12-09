module.exports = `
type snplocus{
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
  chromsome: String
"""
  @original-field
  
  """
  pos: Int
"""
  @original-field
  
  """
  col_number: Int


snpmatrix(search: searchSnpmatrixInput): snpmatrix

  """
  @misc-field
  """
  asCursor: String!
}

type SnplocusConnection{
edges: [SnplocusEdge]
snplocus: [snplocus]
pageInfo: pageInfo!
}

type SnplocusEdge{
cursor: String!
node: snplocus!
}


enum snplocusField {
  id
  snp_matrix_id
  chromsome
  pos
  col_number

}

input searchSnplocusInput {
  field: snplocusField
  value: String
  valueType: InputType
  operator: GenericPrestoSqlOperator  excludeAdapterNames: [String]
  search: [searchSnplocusInput]
}

input orderSnplocusInput{
  field: snplocusField
  order: Order
}

input bulkAssociationSnplocusWithSnp_matrix_idInput{
  id: ID!
  snp_matrix_id: ID!
}

type Query {
  readOneSnplocus(id: ID!): snplocus
  countSnplocus(search: searchSnplocusInput ): Int
  csvTableTemplateSnplocus: [String]
  snplocusConnection(search:searchSnplocusInput, order: [ orderSnplocusInput ], pagination: paginationCursorInput!): SnplocusConnection
  validateSnplocusForCreation( chromsome: String, pos: Int, col_number: Int , addSnpmatrix:ID   , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateSnplocusForUpdating(id: ID!, chromsome: String, pos: Int, col_number: Int , addSnpmatrix:ID, removeSnpmatrix:ID    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateSnplocusForDeletion(id: ID!): Boolean!
  validateSnplocusAfterReading(id: ID!): Boolean!
  """
  snplocusZendroDefinition would return the static Zendro data model definition
  """
  snplocusZendroDefinition: GraphQLJSONObject
}

type Mutation {
  addSnplocus( chromsome: String, pos: Int, col_number: Int , addSnpmatrix:ID   , skipAssociationsExistenceChecks:Boolean = false): snplocus!
  updateSnplocus(id: ID!, chromsome: String, pos: Int, col_number: Int , addSnpmatrix:ID, removeSnpmatrix:ID    , skipAssociationsExistenceChecks:Boolean = false): snplocus!
  deleteSnplocus(id: ID!): String!
    bulkAssociateSnplocusWithSnp_matrix_id(bulkAssociationInput: [bulkAssociationSnplocusWithSnp_matrix_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  bulkDisAssociateSnplocusWithSnp_matrix_id(bulkAssociationInput: [bulkAssociationSnplocusWithSnp_matrix_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
}
`;