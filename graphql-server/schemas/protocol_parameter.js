module.exports = `
  type protocol_parameter{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    parameterName_fk: String

    """
    @original-field
    
    """
    protocol_parameters: [String]

    parameterName(search: searchOntology_annotationInput): ontology_annotation
    
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
    protocol_parametersFilter(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationInput!): [protocol]


    """
    @search-request
    """
    protocol_parametersConnection(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationCursorInput!): ProtocolConnection

    """
    @count-request
    """
    countFilteredProtocol_parameters(search: searchProtocolInput) : Int
  
    """
    @search-request
    """
    process_parameter_value_categoryFilter(search: searchProcess_parameter_valueInput, order: [ orderProcess_parameter_valueInput ], pagination: paginationInput!): [process_parameter_value]


    """
    @search-request
    """
    process_parameter_value_categoryConnection(search: searchProcess_parameter_valueInput, order: [ orderProcess_parameter_valueInput ], pagination: paginationCursorInput!): Process_parameter_valueConnection

    """
    @count-request
    """
    countFilteredProcess_parameter_value_category(search: searchProcess_parameter_valueInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type Protocol_parameterConnection{
  edges: [Protocol_parameterEdge]
  protocol_parameters: [protocol_parameter]
  pageInfo: pageInfo!
}

type Protocol_parameterEdge{
  cursor: String!
  node: protocol_parameter!
}

  enum protocol_parameterField {
    id
    parameterName_fk
    protocol_parameters
  }
  
  input searchProtocol_parameterInput {
    field: protocol_parameterField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchProtocol_parameterInput]
  }

  input orderProtocol_parameterInput{
    field: protocol_parameterField
    order: Order
  }

  input bulkAssociationProtocol_parameterWithParameterName_fkInput{
    id: ID!
    parameterName_fk: ID!
  }

  type Query {
    protocol_parameters(search: searchProtocol_parameterInput, order: [ orderProtocol_parameterInput ], pagination: paginationInput! ): [protocol_parameter]
    readOneProtocol_parameter(id: ID!): protocol_parameter
    countProtocol_parameters(search: searchProtocol_parameterInput ): Int
    csvTableTemplateProtocol_parameter: [String]
    protocol_parametersConnection(search:searchProtocol_parameterInput, order: [ orderProtocol_parameterInput ], pagination: paginationCursorInput! ): Protocol_parameterConnection
    validateProtocol_parameterForCreation(id: ID!, protocol_parameters: [String] , addParameterName:ID  , addComments:[ID], addProtocol_parameters:[ID], addProcess_parameter_value_category:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateProtocol_parameterForUpdating(id: ID!, protocol_parameters: [String] , addParameterName:ID, removeParameterName:ID   , addComments:[ID], removeComments:[ID] , addProtocol_parameters:[ID], removeProtocol_parameters:[ID] , addProcess_parameter_value_category:[ID], removeProcess_parameter_value_category:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateProtocol_parameterForDeletion(id: ID!): Boolean!
    validateProtocol_parameterAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addProtocol_parameter(id: ID!, protocol_parameters: [String] , addParameterName:ID  , addComments:[ID], addProtocol_parameters:[ID], addProcess_parameter_value_category:[ID] , skipAssociationsExistenceChecks:Boolean = false): protocol_parameter!
    updateProtocol_parameter(id: ID!, protocol_parameters: [String] , addParameterName:ID, removeParameterName:ID   , addComments:[ID], removeComments:[ID] , addProtocol_parameters:[ID], removeProtocol_parameters:[ID] , addProcess_parameter_value_category:[ID], removeProcess_parameter_value_category:[ID]  , skipAssociationsExistenceChecks:Boolean = false): protocol_parameter!
    deleteProtocol_parameter(id: ID!): String!
    bulkAddProtocol_parameterCsv: String!
    bulkAssociateProtocol_parameterWithParameterName_fk(bulkAssociationInput: [bulkAssociationProtocol_parameterWithParameterName_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateProtocol_parameterWithParameterName_fk(bulkAssociationInput: [bulkAssociationProtocol_parameterWithParameterName_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;