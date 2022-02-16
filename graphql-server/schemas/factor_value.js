module.exports = `
  type factor_value{
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
    sample_factorValues_fk: [String]

    category(search: searchFactorInput): factor
  unit(search: searchOntology_annotationInput): ontology_annotation
    
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
    @search-request
    """
    sample_factorValuesFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput!): [sample]


    """
    @search-request
    """
    sample_factorValuesConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput!): SampleConnection

    """
    @count-request
    """
    countFilteredSample_factorValues(search: searchSampleInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type Factor_valueConnection{
  edges: [Factor_valueEdge]
  factor_values: [factor_value]
  pageInfo: pageInfo!
}

type Factor_valueEdge{
  cursor: String!
  node: factor_value!
}

  enum factor_valueField {
    id
    category_fk
    value
    unit_fk
    sample_factorValues_fk
  }
  
  input searchFactor_valueInput {
    field: factor_valueField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchFactor_valueInput]
  }

  input orderFactor_valueInput{
    field: factor_valueField
    order: Order
  }

  input bulkAssociationFactor_valueWithCategory_fkInput{
    id: ID!
    category_fk: ID!
  }  input bulkAssociationFactor_valueWithUnit_fkInput{
    id: ID!
    unit_fk: ID!
  }

  type Query {
    factor_values(search: searchFactor_valueInput, order: [ orderFactor_valueInput ], pagination: paginationInput! ): [factor_value]
    readOneFactor_value(id: ID!): factor_value
    countFactor_values(search: searchFactor_valueInput ): Int
    csvTableTemplateFactor_value: [String]
    factor_valuesConnection(search:searchFactor_valueInput, order: [ orderFactor_valueInput ], pagination: paginationCursorInput! ): Factor_valueConnection
    validateFactor_valueForCreation(id: ID!, value: String , addCategory:ID, addUnit:ID  , addComments:[ID], addSample_factorValues:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateFactor_valueForUpdating(id: ID!, value: String , addCategory:ID, removeCategory:ID , addUnit:ID, removeUnit:ID   , addComments:[ID], removeComments:[ID] , addSample_factorValues:[ID], removeSample_factorValues:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateFactor_valueForDeletion(id: ID!): Boolean!
    validateFactor_valueAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addFactor_value(id: ID!, value: String , addCategory:ID, addUnit:ID  , addComments:[ID], addSample_factorValues:[ID] , skipAssociationsExistenceChecks:Boolean = false): factor_value!
    updateFactor_value(id: ID!, value: String , addCategory:ID, removeCategory:ID , addUnit:ID, removeUnit:ID   , addComments:[ID], removeComments:[ID] , addSample_factorValues:[ID], removeSample_factorValues:[ID]  , skipAssociationsExistenceChecks:Boolean = false): factor_value!
    deleteFactor_value(id: ID!): String!
    bulkAddFactor_valueCsv: String!
    bulkAssociateFactor_valueWithCategory_fk(bulkAssociationInput: [bulkAssociationFactor_valueWithCategory_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateFactor_valueWithCategory_fk(bulkAssociationInput: [bulkAssociationFactor_valueWithCategory_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateFactor_valueWithUnit_fk(bulkAssociationInput: [bulkAssociationFactor_valueWithUnit_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateFactor_valueWithUnit_fk(bulkAssociationInput: [bulkAssociationFactor_valueWithUnit_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;