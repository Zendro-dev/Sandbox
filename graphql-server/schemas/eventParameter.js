module.exports = `
  type eventParameter{
    """
    @original-field
    """
    eventParameterDbId: ID
    """
    @original-field
    
    """
    key: String

    """
    @original-field
    
    """
    rdfValue: String

    """
    @original-field
    
    """
    value: String

    """
    @original-field
    
    """
    eventDbId: String

    event(search: searchEventInput): event
    
    }
type EventParameterConnection{
  edges: [EventParameterEdge]
  pageInfo: pageInfo!
}

type EventParameterEdge{
  cursor: String!
  node: eventParameter!
}

  type VueTableEventParameter{
    data : [eventParameter]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum eventParameterField {
    eventParameterDbId
    key
    rdfValue
    value
    eventDbId
  }
  input searchEventParameterInput {
    field: eventParameterField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchEventParameterInput]
  }

  input orderEventParameterInput{
    field: eventParameterField
    order: Order
  }

  input bulkAssociationEventParameterWithEventDbIdInput{
    eventParameterDbId: ID!
    eventDbId: ID!
  }

  type Query {
    eventParameters(search: searchEventParameterInput, order: [ orderEventParameterInput ], pagination: paginationInput! ): [eventParameter]
    readOneEventParameter(eventParameterDbId: ID!): eventParameter
    countEventParameters(search: searchEventParameterInput ): Int
    vueTableEventParameter : VueTableEventParameter    csvTableTemplateEventParameter: [String]
    eventParametersConnection(search:searchEventParameterInput, order: [ orderEventParameterInput ], pagination: paginationCursorInput! ): EventParameterConnection
  }

  type Mutation {
    addEventParameter(eventParameterDbId: ID!, key: String, rdfValue: String, value: String , addEvent:ID   , skipAssociationsExistenceChecks:Boolean = false): eventParameter!
    updateEventParameter(eventParameterDbId: ID!, key: String, rdfValue: String, value: String , addEvent:ID, removeEvent:ID    , skipAssociationsExistenceChecks:Boolean = false): eventParameter!
    deleteEventParameter(eventParameterDbId: ID!): String!
    bulkAddEventParameterCsv: String!
    bulkAssociateEventParameterWithEventDbId(bulkAssociationInput: [bulkAssociationEventParameterWithEventDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateEventParameterWithEventDbId(bulkAssociationInput: [bulkAssociationEventParameterWithEventDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;