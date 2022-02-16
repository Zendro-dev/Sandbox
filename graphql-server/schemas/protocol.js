module.exports = `
  type protocol{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    protocolType_fk: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    uri: String

    """
    @original-field
    
    """
    version: String

    """
    @original-field
    
    """
    parameters_fk: [String]

    """
    @original-field
    
    """
    components_fk: [String]

    """
    @original-field
    
    """
    study_protocols_fk: [String]

    protocolType(search: searchOntology_annotationInput): ontology_annotation
    
    """
    @search-request
    """
    componentsFilter(search: searchComponentInput, order: [ orderComponentInput ], pagination: paginationInput!): [component]


    """
    @search-request
    """
    componentsConnection(search: searchComponentInput, order: [ orderComponentInput ], pagination: paginationCursorInput!): ComponentConnection

    """
    @count-request
    """
    countFilteredComponents(search: searchComponentInput) : Int
  
    """
    @search-request
    """
    parametersFilter(search: searchProtocol_parameterInput, order: [ orderProtocol_parameterInput ], pagination: paginationInput!): [protocol_parameter]


    """
    @search-request
    """
    parametersConnection(search: searchProtocol_parameterInput, order: [ orderProtocol_parameterInput ], pagination: paginationCursorInput!): Protocol_parameterConnection

    """
    @count-request
    """
    countFilteredParameters(search: searchProtocol_parameterInput) : Int
  
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
    process_executesProtocolFilter(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationInput!): [process]


    """
    @search-request
    """
    process_executesProtocolConnection(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationCursorInput!): ProcessConnection

    """
    @count-request
    """
    countFilteredProcess_executesProtocol(search: searchProcessInput) : Int
  
    """
    @search-request
    """
    study_protocolsFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    study_protocolsConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudy_protocols(search: searchStudyInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type ProtocolConnection{
  edges: [ProtocolEdge]
  protocols: [protocol]
  pageInfo: pageInfo!
}

type ProtocolEdge{
  cursor: String!
  node: protocol!
}

  enum protocolField {
    id
    name
    protocolType_fk
    description
    uri
    version
    parameters_fk
    components_fk
    study_protocols_fk
  }
  
  input searchProtocolInput {
    field: protocolField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchProtocolInput]
  }

  input orderProtocolInput{
    field: protocolField
    order: Order
  }

  input bulkAssociationProtocolWithProtocolType_fkInput{
    id: ID!
    protocolType_fk: ID!
  }

  type Query {
    protocols(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationInput! ): [protocol]
    readOneProtocol(id: ID!): protocol
    countProtocols(search: searchProtocolInput ): Int
    csvTableTemplateProtocol: [String]
    protocolsConnection(search:searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationCursorInput! ): ProtocolConnection
    validateProtocolForCreation(id: ID!, name: String, description: String, uri: String, version: String , addProtocolType:ID  , addComponents:[ID], addParameters:[ID], addComments:[ID], addProcess_executesProtocol:[ID], addStudy_protocols:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateProtocolForUpdating(id: ID!, name: String, description: String, uri: String, version: String , addProtocolType:ID, removeProtocolType:ID   , addComponents:[ID], removeComponents:[ID] , addParameters:[ID], removeParameters:[ID] , addComments:[ID], removeComments:[ID] , addProcess_executesProtocol:[ID], removeProcess_executesProtocol:[ID] , addStudy_protocols:[ID], removeStudy_protocols:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateProtocolForDeletion(id: ID!): Boolean!
    validateProtocolAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addProtocol(id: ID!, name: String, description: String, uri: String, version: String , addProtocolType:ID  , addComponents:[ID], addParameters:[ID], addComments:[ID], addProcess_executesProtocol:[ID], addStudy_protocols:[ID] , skipAssociationsExistenceChecks:Boolean = false): protocol!
    updateProtocol(id: ID!, name: String, description: String, uri: String, version: String , addProtocolType:ID, removeProtocolType:ID   , addComponents:[ID], removeComponents:[ID] , addParameters:[ID], removeParameters:[ID] , addComments:[ID], removeComments:[ID] , addProcess_executesProtocol:[ID], removeProcess_executesProtocol:[ID] , addStudy_protocols:[ID], removeStudy_protocols:[ID]  , skipAssociationsExistenceChecks:Boolean = false): protocol!
    deleteProtocol(id: ID!): String!
    bulkAddProtocolCsv: String!
    bulkAssociateProtocolWithProtocolType_fk(bulkAssociationInput: [bulkAssociationProtocolWithProtocolType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateProtocolWithProtocolType_fk(bulkAssociationInput: [bulkAssociationProtocolWithProtocolType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;