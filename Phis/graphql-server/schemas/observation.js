module.exports = `
type observation{
  """
  @original-field
  """
  observationDbId: ID

"""
  @original-field
  
  """
  collector: String

"""
  @original-field
  
  """
  germplasmDbId: String

"""
  @original-field
  
  """
  observationTimeStamp: DateTime

"""
  @original-field
  
  """
  observationUnitDbId: String

"""
  @original-field
  
  """
  observationVariableDbId: String

"""
  @original-field
  
  """
  studyDbId: String

"""
  @original-field
  
  """
  uploadedBy: String

"""
  @original-field
  
  """
  value: String

"""
  @original-field
  
  """
  seasonDbId: String

"""
  @original-field
  
  """
  imageDbId: String

season(search: searchSeasonInput): season
germplasm(search: searchGermplasmInput): germplasm
observationUnit(search: searchObservationUnitInput): observationUnit
observationVariable(search: searchObservationVariableInput): observationVariable
study(search: searchStudyInput): study
image(search: searchImageInput): image
}

type ObservationConnection{
edges: [ObservationEdge]
pageInfo: pageInfo!
}

type ObservationEdge{
cursor: String!
node: observation!
}

type VueTableObservation{
  data : [observation]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum observationField {
  observationDbId
  collector
  germplasmDbId
  observationTimeStamp
  observationUnitDbId
  observationVariableDbId
  studyDbId
  uploadedBy
  value
  seasonDbId
  imageDbId
}

input searchObservationInput {
  field: observationField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchObservationInput]
}

input orderObservationInput{
  field: observationField
  order: Order
}

type Query {
  readOneObservation(observationDbId: ID!): observation
  countObservations(search: searchObservationInput ): Int
  vueTableObservation : VueTableObservation  csvTableTemplateObservation: [String]

  observationsConnection(search:searchObservationInput, order: [ orderObservationInput ], pagination: paginationCursorInput ): ObservationConnection
}

  type Mutation {
  addObservation(observationDbId: ID!, collector: String, observationTimeStamp: DateTime, uploadedBy: String, value: String , addSeason:ID, addGermplasm:ID, addObservationUnit:ID, addObservationVariable:ID, addStudy:ID, addImage:ID , skipAssociationsExistenceChecks:Boolean = false): observation!
  updateObservation(observationDbId: ID!, collector: String, observationTimeStamp: DateTime, uploadedBy: String, value: String , addSeason:ID, removeSeason:ID , addGermplasm:ID, removeGermplasm:ID , addObservationUnit:ID, removeObservationUnit:ID , addObservationVariable:ID, removeObservationVariable:ID , addStudy:ID, removeStudy:ID , addImage:ID, removeImage:ID  , skipAssociationsExistenceChecks:Boolean = false): observation!
deleteObservation(observationDbId: ID!): String!
bulkAddObservationCsv: [observation] }

`;