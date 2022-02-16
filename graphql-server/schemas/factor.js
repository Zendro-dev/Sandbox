module.exports = `
  type factor{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    factorName: String

    """
    @original-field
    
    """
    factorType_fk: String

    """
    @original-field
    
    """
    study_factors_fk: [String]

    factorType(search: searchOntology_annotationInput): ontology_annotation
    
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
    study_factorsFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    study_factorsConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudy_factors(search: searchStudyInput) : Int
  
    """
    @search-request
    """
    factor_value_categoryFilter(search: searchFactor_valueInput, order: [ orderFactor_valueInput ], pagination: paginationInput!): [factor_value]


    """
    @search-request
    """
    factor_value_categoryConnection(search: searchFactor_valueInput, order: [ orderFactor_valueInput ], pagination: paginationCursorInput!): Factor_valueConnection

    """
    @count-request
    """
    countFilteredFactor_value_category(search: searchFactor_valueInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type FactorConnection{
  edges: [FactorEdge]
  factors: [factor]
  pageInfo: pageInfo!
}

type FactorEdge{
  cursor: String!
  node: factor!
}

  enum factorField {
    id
    factorName
    factorType_fk
    study_factors_fk
  }
  
  input searchFactorInput {
    field: factorField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchFactorInput]
  }

  input orderFactorInput{
    field: factorField
    order: Order
  }

  input bulkAssociationFactorWithFactorType_fkInput{
    id: ID!
    factorType_fk: ID!
  }

  type Query {
    factors(search: searchFactorInput, order: [ orderFactorInput ], pagination: paginationInput! ): [factor]
    readOneFactor(id: ID!): factor
    countFactors(search: searchFactorInput ): Int
    csvTableTemplateFactor: [String]
    factorsConnection(search:searchFactorInput, order: [ orderFactorInput ], pagination: paginationCursorInput! ): FactorConnection
    validateFactorForCreation(id: ID!, factorName: String , addFactorType:ID  , addComments:[ID], addStudy_factors:[ID], addFactor_value_category:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateFactorForUpdating(id: ID!, factorName: String , addFactorType:ID, removeFactorType:ID   , addComments:[ID], removeComments:[ID] , addStudy_factors:[ID], removeStudy_factors:[ID] , addFactor_value_category:[ID], removeFactor_value_category:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateFactorForDeletion(id: ID!): Boolean!
    validateFactorAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addFactor(id: ID!, factorName: String , addFactorType:ID  , addComments:[ID], addStudy_factors:[ID], addFactor_value_category:[ID] , skipAssociationsExistenceChecks:Boolean = false): factor!
    updateFactor(id: ID!, factorName: String , addFactorType:ID, removeFactorType:ID   , addComments:[ID], removeComments:[ID] , addStudy_factors:[ID], removeStudy_factors:[ID] , addFactor_value_category:[ID], removeFactor_value_category:[ID]  , skipAssociationsExistenceChecks:Boolean = false): factor!
    deleteFactor(id: ID!): String!
    bulkAddFactorCsv: String!
    bulkAssociateFactorWithFactorType_fk(bulkAssociationInput: [bulkAssociationFactorWithFactorType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateFactorWithFactorType_fk(bulkAssociationInput: [bulkAssociationFactorWithFactorType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;