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
  observation_unitsConnection(search: searchObservation_unitInput, order: [ orderObservation_unitInput ], pagination: paginationCursorInput!): Observation_unitConnection
  """
  @count-request
  """
  countFilteredObservation_units(search: searchObservation_unitInput) : Int

  """
  @misc-field
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

type VueTableEvent{
  data : [event]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
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
  operator: GenericPrestoSqlOperator  excludeAdapterNames: [String]
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
  readOneEvent(id: ID!): event
  countEvents(search: searchEventInput ): Int
  vueTableEvent : VueTableEvent  csvTableTemplateEvent: [String]
  eventsConnection(search:searchEventInput, order: [ orderEventInput ], pagination: paginationCursorInput!): EventConnection
  validateEventForCreation(id: ID!, type: String, accession_number: String, description: String, dates: [DateTime] , addStudy:ID  , addObservation_units:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateEventForUpdating(id: ID!, type: String, accession_number: String, description: String, dates: [DateTime] , addStudy:ID, removeStudy:ID   , addObservation_units:[ID], removeObservation_units:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateEventForDeletion(id: ID!): Boolean!
  validateEventAfterReading(id: ID!): Boolean!
}

type Mutation {
  addEvent(id: ID!, type: String, accession_number: String, description: String, dates: [DateTime] , addStudy:ID  , addObservation_units:[ID] , skipAssociationsExistenceChecks:Boolean = false): event!
  updateEvent(id: ID!, type: String, accession_number: String, description: String, dates: [DateTime] , addStudy:ID, removeStudy:ID   , addObservation_units:[ID], removeObservation_units:[ID]  , skipAssociationsExistenceChecks:Boolean = false): event!
  deleteEvent(id: ID!): String!
  bulkAddEventCsv: String
  bulkAssociateEventWithStudy_id(bulkAssociationInput: [bulkAssociationEventWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  bulkDisAssociateEventWithStudy_id(bulkAssociationInput: [bulkAssociationEventWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
}
`;