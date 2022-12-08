module.exports = `
  type event{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    type: String

    """
    @original-field
    
    """
    accession_number: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    dates: [DateTime]

    """
    @original-field
    
    """
    study_id: String

    """
    @original-field
    
    """
    observation_unit_ids: [String]

    study(search: searchStudyInput): study
    
    """
    @search-request
    """
    observation_unitsFilter(search: searchObservation_unitInput, order: [ orderObservation_unitInput ], pagination: paginationInput!): [observation_unit]


    """
    @search-request
    """
    observation_unitsConnection(search: searchObservation_unitInput, order: [ orderObservation_unitInput ], pagination: paginationCursorInput!): Observation_unitConnection

    """
    @count-request
    """
    countFilteredObservation_units(search: searchObservation_unitInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type EventConnection{
  edges: [EventEdge]
  events: [event]
  pageInfo: pageInfo!
}

type EventEdge{
  cursor: String!
  node: event!
}

  enum eventField {
    id
    type
    accession_number
    description
    dates
    study_id
    observation_unit_ids
  }
  
  input searchEventInput {
    field: eventField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchEventInput]
  }

  input orderEventInput{
    field: eventField
    order: Order
  }

  input bulkAssociationEventWithStudy_idInput{
    id: ID!
    study_id: ID!
  }

  type Query {
    events(search: searchEventInput, order: [ orderEventInput ], pagination: paginationInput! ): [event]
    readOneEvent(id: ID!): event
    countEvents(search: searchEventInput ): Int
    csvTableTemplateEvent: [String]
    eventsConnection(search:searchEventInput, order: [ orderEventInput ], pagination: paginationCursorInput! ): EventConnection
    validateEventForCreation(id: ID!, type: String, accession_number: String, description: String, dates: [DateTime] , addStudy:ID  , addObservation_units:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateEventForUpdating(id: ID!, type: String, accession_number: String, description: String, dates: [DateTime] , addStudy:ID, removeStudy:ID   , addObservation_units:[ID], removeObservation_units:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateEventForDeletion(id: ID!): Boolean!
    validateEventAfterReading(id: ID!): Boolean!
    """
    eventsZendroDefinition would return the static Zendro data model definition
    """
    eventsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addEvent(id: ID!, type: String, accession_number: String, description: String, dates: [DateTime] , addStudy:ID  , addObservation_units:[ID] , skipAssociationsExistenceChecks:Boolean = false): event!
    updateEvent(id: ID!, type: String, accession_number: String, description: String, dates: [DateTime] , addStudy:ID, removeStudy:ID   , addObservation_units:[ID], removeObservation_units:[ID]  , skipAssociationsExistenceChecks:Boolean = false): event!
    deleteEvent(id: ID!): String!
        bulkAssociateEventWithStudy_id(bulkAssociationInput: [bulkAssociationEventWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateEventWithStudy_id(bulkAssociationInput: [bulkAssociationEventWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;