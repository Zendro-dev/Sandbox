module.exports = `
type observationUnit{
  """
  @original-field
  """
  observationUnitDbId: ID

"""
  @original-field
  
  """
  germplasmDbId: String

"""
  @original-field
  
  """
  locationDbId: String

"""
  @original-field
  
  """
  observationLevel: String

"""
  @original-field
  
  """
  observationUnitName: String

"""
  @original-field
  
  """
  observationUnitPUI: String

"""
  @original-field
  
  """
  plantNumber: String

"""
  @original-field
  
  """
  plotNumber: String

"""
  @original-field
  
  """
  programDbId: String

"""
  @original-field
  
  """
  studyDbId: String

"""
  @original-field
  
  """
  trialDbId: String

observationUnitPosition(search: searchObservationUnitPositionInput): observationUnitPosition
germplasm(search: searchGermplasmInput): germplasm
location(search: searchLocationInput): location
program(search: searchProgramInput): program
study(search: searchStudyInput): study
trial(search: searchTrialInput): trial

  """
  @search-request
  """
  observationTreatmentsConnection(search: searchObservationTreatmentInput, order: [ orderObservationTreatmentInput ], pagination: paginationCursorInput): ObservationTreatmentConnection

  """
  @count-request
  """
  countFilteredObservationTreatments(search: searchObservationTreatmentInput) : Int

  """
  @search-request
  """
  observationsConnection(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationCursorInput): ObservationConnection

  """
  @count-request
  """
  countFilteredObservations(search: searchObservationInput) : Int

  """
  @search-request
  """
  imagesConnection(search: searchImageInput, order: [ orderImageInput ], pagination: paginationCursorInput): ImageConnection

  """
  @count-request
  """
  countFilteredImages(search: searchImageInput) : Int

  """
  @search-request
  """
  observationUnitToEventsConnection(search: searchObservationUnit_to_eventInput, order: [ orderObservationUnit_to_eventInput ], pagination: paginationCursorInput): ObservationUnit_to_eventConnection

  """
  @count-request
  """
  countFilteredObservationUnitToEvents(search: searchObservationUnit_to_eventInput) : Int
}

type ObservationUnitConnection{
edges: [ObservationUnitEdge]
pageInfo: pageInfo!
}

type ObservationUnitEdge{
cursor: String!
node: observationUnit!
}

type VueTableObservationUnit{
  data : [observationUnit]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum observationUnitField {
  observationUnitDbId
  germplasmDbId
  locationDbId
  observationLevel
  observationUnitName
  observationUnitPUI
  plantNumber
  plotNumber
  programDbId
  studyDbId
  trialDbId
}

input searchObservationUnitInput {
  field: observationUnitField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchObservationUnitInput]
}

input orderObservationUnitInput{
  field: observationUnitField
  order: Order
}

type Query {
  observationUnits(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationInput ): [observationUnit]
  readOneObservationUnit(observationUnitDbId: ID!): observationUnit
  countObservationUnits(search: searchObservationUnitInput ): Int
  vueTableObservationUnit : VueTableObservationUnit  csvTableTemplateObservationUnit: [String]

  observationUnitsConnection(search:searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationCursorInput ): ObservationUnitConnection
}

  type Mutation {
  addObservationUnit(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String, plotNumber: String , addObservationUnitPosition:ID, addGermplasm:ID, addLocation:ID, addProgram:ID, addStudy:ID, addTrial:ID , addObservationTreatments:[ID], addObservations:[ID], addImages:[ID], addObservationUnitToEvents:[ID], skipAssociationsExistenceChecks:Boolean = false): observationUnit!
  updateObservationUnit(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String, plotNumber: String , addObservationUnitPosition:ID, removeObservationUnitPosition:ID , addGermplasm:ID, removeGermplasm:ID , addLocation:ID, removeLocation:ID , addProgram:ID, removeProgram:ID , addStudy:ID, removeStudy:ID , addTrial:ID, removeTrial:ID  , addObservationTreatments:[ID], removeObservationTreatments:[ID] , addObservations:[ID], removeObservations:[ID] , addImages:[ID], removeImages:[ID] , addObservationUnitToEvents:[ID], removeObservationUnitToEvents:[ID] , skipAssociationsExistenceChecks:Boolean = false): observationUnit!
deleteObservationUnit(observationUnitDbId: ID!): String!
bulkAddObservationUnitCsv: [observationUnit] }

`;