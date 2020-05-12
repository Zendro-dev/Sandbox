module.exports = `
type event{
  """
  @original-field
  """
  eventType: ID

"""
  @original-field
  
  """
  eventDbId: String

"""
  @original-field
  
  """
  eventDescription: String

"""
  @original-field
  
  """
  studyDbId: String

"""
  @original-field
  
  """
  date: DateTime

study(search: searchStudyInput): study

  """
  @search-request
  """
  eventParametersConnection(search: searchEventParameterInput, order: [ orderEventParameterInput ], pagination: paginationCursorInput): EventParameterConnection

  """
  @count-request
  """
  countFilteredEventParameters(search: searchEventParameterInput) : Int

  """
  @search-request
  """
  eventToObservationUnitsConnection(search: searchObservationUnit_to_eventInput, order: [ orderObservationUnit_to_eventInput ], pagination: paginationCursorInput): ObservationUnit_to_eventConnection

  """
  @count-request
  """
  countFilteredEventToObservationUnits(search: searchObservationUnit_to_eventInput) : Int
}

type EventConnection{
edges: [EventEdge]
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
  eventType
  eventDbId
  eventDescription
  studyDbId
  date
}

input searchEventInput {
  field: eventField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchEventInput]
}

input orderEventInput{
  field: eventField
  order: Order
}

type Query {
  readOneEvent(eventType: ID!): event
  countEvents(search: searchEventInput ): Int
  vueTableEvent : VueTableEvent  csvTableTemplateEvent: [String]

  eventsConnection(search:searchEventInput, order: [ orderEventInput ], pagination: paginationCursorInput ): EventConnection
}

  type Mutation {
  addEvent(eventType: ID!, eventDbId: String, eventDescription: String, date: DateTime , addStudy:ID , addEventParameters:[ID], addEventToObservationUnits:[ID], skipAssociationsExistenceChecks:Boolean = false): event!
  updateEvent(eventType: ID!, eventDbId: String, eventDescription: String, date: DateTime , addStudy:ID, removeStudy:ID  , addEventParameters:[ID], removeEventParameters:[ID] , addEventToObservationUnits:[ID], removeEventToObservationUnits:[ID] , skipAssociationsExistenceChecks:Boolean = false): event!
deleteEvent(eventType: ID!): String!
bulkAddEventCsv: [event] }

`;