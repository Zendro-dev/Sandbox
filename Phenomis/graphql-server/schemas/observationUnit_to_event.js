module.exports = `
type observationUnit_to_event{
  """
  @original-field
  """
  id: ID

"""
  @original-field
  
  """
  observationUnitDbId: String

"""
  @original-field
  
  """
  eventDbId: String

observationUnit(search: searchObservationUnitInput): observationUnit
event(search: searchEventInput): event
}

type ObservationUnit_to_eventConnection{
edges: [ObservationUnit_to_eventEdge]
pageInfo: pageInfo!
}

type ObservationUnit_to_eventEdge{
cursor: String!
node: observationUnit_to_event!
}

type VueTableObservationUnit_to_event{
  data : [observationUnit_to_event]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum observationUnit_to_eventField {
  id
  observationUnitDbId
  eventDbId
}

input searchObservationUnit_to_eventInput {
  field: observationUnit_to_eventField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchObservationUnit_to_eventInput]
}

input orderObservationUnit_to_eventInput{
  field: observationUnit_to_eventField
  order: Order
}

type Query {
  observationUnit_to_events(search: searchObservationUnit_to_eventInput, order: [ orderObservationUnit_to_eventInput ], pagination: paginationInput ): [observationUnit_to_event]
  readOneObservationUnit_to_event(id: ID!): observationUnit_to_event
  countObservationUnit_to_events(search: searchObservationUnit_to_eventInput ): Int
  vueTableObservationUnit_to_event : VueTableObservationUnit_to_event  csvTableTemplateObservationUnit_to_event: [String]

  observationUnit_to_eventsConnection(search:searchObservationUnit_to_eventInput, order: [ orderObservationUnit_to_eventInput ], pagination: paginationCursorInput ): ObservationUnit_to_eventConnection
}

  type Mutation {
  addObservationUnit_to_event(  , addObservationUnit:ID, addEvent:ID , skipAssociationsExistenceChecks:Boolean = false): observationUnit_to_event!
  updateObservationUnit_to_event(id: ID!,  , addObservationUnit:ID, removeObservationUnit:ID , addEvent:ID, removeEvent:ID  , skipAssociationsExistenceChecks:Boolean = false): observationUnit_to_event!
deleteObservationUnit_to_event(id: ID!): String!
bulkAddObservationUnit_to_eventCsv: [observationUnit_to_event] }

`;