module.exports = `
  type component{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    componentName: String

    """
    @original-field
    
    """
    componentType_fk: String

    """
    @original-field
    
    """
    protocol_components_fk: [String]

    componentType(search: searchOntology_annotationInput): ontology_annotation
    
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
    protocol_componentsFilter(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationInput!): [protocol]


    """
    @search-request
    """
    protocol_componentsConnection(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationCursorInput!): ProtocolConnection

    """
    @count-request
    """
    countFilteredProtocol_components(search: searchProtocolInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type ComponentConnection{
  edges: [ComponentEdge]
  components: [component]
  pageInfo: pageInfo!
}

type ComponentEdge{
  cursor: String!
  node: component!
}

  enum componentField {
    id
    componentName
    componentType_fk
    protocol_components_fk
  }
  
  input searchComponentInput {
    field: componentField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchComponentInput]
  }

  input orderComponentInput{
    field: componentField
    order: Order
  }

  input bulkAssociationComponentWithComponentType_fkInput{
    id: ID!
    componentType_fk: ID!
  }

  type Query {
    components(search: searchComponentInput, order: [ orderComponentInput ], pagination: paginationInput! ): [component]
    readOneComponent(id: ID!): component
    countComponents(search: searchComponentInput ): Int
    csvTableTemplateComponent: [String]
    componentsConnection(search:searchComponentInput, order: [ orderComponentInput ], pagination: paginationCursorInput! ): ComponentConnection
    validateComponentForCreation(id: ID!, componentName: String , addComponentType:ID  , addComments:[ID], addProtocol_components:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateComponentForUpdating(id: ID!, componentName: String , addComponentType:ID, removeComponentType:ID   , addComments:[ID], removeComments:[ID] , addProtocol_components:[ID], removeProtocol_components:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateComponentForDeletion(id: ID!): Boolean!
    validateComponentAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addComponent(id: ID!, componentName: String , addComponentType:ID  , addComments:[ID], addProtocol_components:[ID] , skipAssociationsExistenceChecks:Boolean = false): component!
    updateComponent(id: ID!, componentName: String , addComponentType:ID, removeComponentType:ID   , addComments:[ID], removeComments:[ID] , addProtocol_components:[ID], removeProtocol_components:[ID]  , skipAssociationsExistenceChecks:Boolean = false): component!
    deleteComponent(id: ID!): String!
    bulkAddComponentCsv: String!
    bulkAssociateComponentWithComponentType_fk(bulkAssociationInput: [bulkAssociationComponentWithComponentType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateComponentWithComponentType_fk(bulkAssociationInput: [bulkAssociationComponentWithComponentType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;