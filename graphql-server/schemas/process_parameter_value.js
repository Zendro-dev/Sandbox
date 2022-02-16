module.exports = `
  type process_parameter_value{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    category_fk: String

    """
    @original-field
    
    """
    value: String

    """
    @original-field
    
    """
    unit_fk: String

    """
    @original-field
    
    """
    process_parameterValues_fk: String

    category(search: searchProtocol_parameterInput): protocol_parameter
  unit(search: searchOntology_annotationInput): ontology_annotation
  process_parameterValues(search: searchProcessInput): process
    
    """
    @search-request
    """
    commentsFilter(search: searchCommentInput, order: [ orderCommentInput ], pagination: paginationInput!): [comment]


    """
    @search-request
    """
    commentsConnection(search: searchCommentInput, order: [ orderCommentInput ], pagination: paginationCursorInput!): CommentConnection

    """
    @count-request
    """
    countFilteredComments(search: searchCommentInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type Process_parameter_valueConnection{
  edges: [Process_parameter_valueEdge]
  process_parameter_values: [process_parameter_value]
  pageInfo: pageInfo!
}

type Process_parameter_valueEdge{
  cursor: String!
  node: process_parameter_value!
}

  enum process_parameter_valueField {
    id
    category_fk
    value
    unit_fk
    process_parameterValues_fk
  }
  
  input searchProcess_parameter_valueInput {
    field: process_parameter_valueField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchProcess_parameter_valueInput]
  }

  input orderProcess_parameter_valueInput{
    field: process_parameter_valueField
    order: Order
  }

  input bulkAssociationProcess_parameter_valueWithCategory_fkInput{
    id: ID!
    category_fk: ID!
  }  input bulkAssociationProcess_parameter_valueWithUnit_fkInput{
    id: ID!
    unit_fk: ID!
  }  input bulkAssociationProcess_parameter_valueWithProcess_parameterValues_fkInput{
    id: ID!
    process_parameterValues_fk: ID!
  }

  type Query {
    process_parameter_values(search: searchProcess_parameter_valueInput, order: [ orderProcess_parameter_valueInput ], pagination: paginationInput! ): [process_parameter_value]
    readOneProcess_parameter_value(id: ID!): process_parameter_value
    countProcess_parameter_values(search: searchProcess_parameter_valueInput ): Int
    csvTableTemplateProcess_parameter_value: [String]
    process_parameter_valuesConnection(search:searchProcess_parameter_valueInput, order: [ orderProcess_parameter_valueInput ], pagination: paginationCursorInput! ): Process_parameter_valueConnection
    validateProcess_parameter_valueForCreation(id: ID!, value: String , addCategory:ID, addUnit:ID, addProcess_parameterValues:ID  , addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateProcess_parameter_valueForUpdating(id: ID!, value: String , addCategory:ID, removeCategory:ID , addUnit:ID, removeUnit:ID , addProcess_parameterValues:ID, removeProcess_parameterValues:ID   , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateProcess_parameter_valueForDeletion(id: ID!): Boolean!
    validateProcess_parameter_valueAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addProcess_parameter_value(id: ID!, value: String , addCategory:ID, addUnit:ID, addProcess_parameterValues:ID  , addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): process_parameter_value!
    updateProcess_parameter_value(id: ID!, value: String , addCategory:ID, removeCategory:ID , addUnit:ID, removeUnit:ID , addProcess_parameterValues:ID, removeProcess_parameterValues:ID   , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): process_parameter_value!
    deleteProcess_parameter_value(id: ID!): String!
    bulkAddProcess_parameter_valueCsv: String!
    bulkAssociateProcess_parameter_valueWithCategory_fk(bulkAssociationInput: [bulkAssociationProcess_parameter_valueWithCategory_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateProcess_parameter_valueWithCategory_fk(bulkAssociationInput: [bulkAssociationProcess_parameter_valueWithCategory_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateProcess_parameter_valueWithUnit_fk(bulkAssociationInput: [bulkAssociationProcess_parameter_valueWithUnit_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateProcess_parameter_valueWithUnit_fk(bulkAssociationInput: [bulkAssociationProcess_parameter_valueWithUnit_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateProcess_parameter_valueWithProcess_parameterValues_fk(bulkAssociationInput: [bulkAssociationProcess_parameter_valueWithProcess_parameterValues_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateProcess_parameter_valueWithProcess_parameterValues_fk(bulkAssociationInput: [bulkAssociationProcess_parameter_valueWithProcess_parameterValues_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;