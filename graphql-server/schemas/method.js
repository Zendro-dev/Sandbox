module.exports = `
  type method{
    """
    @original-field
    """
    methodDbId: ID
    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    formula: String

    """
    @original-field
    
    """
    methodClass: String

    """
    @original-field
    
    """
    methodName: String

    """
    @original-field
    
    """
    reference: String

    """
    @original-field
    
    """
    ontologyDbId: String

    ontologyReference(search: searchOntologyReferenceInput): ontologyReference
    
    """
    @search-request
    """
    observationVariablesFilter(search: searchObservationVariableInput, order: [ orderObservationVariableInput ], pagination: paginationInput!): [observationVariable]


    """
    @search-request
    """
    observationVariablesConnection(search: searchObservationVariableInput, order: [ orderObservationVariableInput ], pagination: paginationCursorInput!): ObservationVariableConnection

    """
    @count-request
    """
    countFilteredObservationVariables(search: searchObservationVariableInput) : Int
  
    }
type MethodConnection{
  edges: [MethodEdge]
  pageInfo: pageInfo!
}

type MethodEdge{
  cursor: String!
  node: method!
}

  type VueTableMethod{
    data : [method]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum methodField {
    methodDbId
    description
    formula
    methodClass
    methodName
    reference
    ontologyDbId
  }
  input searchMethodInput {
    field: methodField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchMethodInput]
  }

  input orderMethodInput{
    field: methodField
    order: Order
  }

  input bulkAssociationMethodWithOntologyDbIdInput{
    methodDbId: ID!
    ontologyDbId: ID!
  }

  type Query {
    methods(search: searchMethodInput, order: [ orderMethodInput ], pagination: paginationInput! ): [method]
    readOneMethod(methodDbId: ID!): method
    countMethods(search: searchMethodInput ): Int
    vueTableMethod : VueTableMethod    csvTableTemplateMethod: [String]
    methodsConnection(search:searchMethodInput, order: [ orderMethodInput ], pagination: paginationCursorInput! ): MethodConnection
  }

  type Mutation {
    addMethod(methodDbId: ID!, description: String, formula: String, methodClass: String, methodName: String, reference: String , addOntologyReference:ID  , addObservationVariables:[ID] , skipAssociationsExistenceChecks:Boolean = false): method!
    updateMethod(methodDbId: ID!, description: String, formula: String, methodClass: String, methodName: String, reference: String , addOntologyReference:ID, removeOntologyReference:ID   , addObservationVariables:[ID], removeObservationVariables:[ID]  , skipAssociationsExistenceChecks:Boolean = false): method!
    deleteMethod(methodDbId: ID!): String!
    bulkAddMethodCsv: String!
    bulkAssociateMethodWithOntologyDbId(bulkAssociationInput: [bulkAssociationMethodWithOntologyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateMethodWithOntologyDbId(bulkAssociationInput: [bulkAssociationMethodWithOntologyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;