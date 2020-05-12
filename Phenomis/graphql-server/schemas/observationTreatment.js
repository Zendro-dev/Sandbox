module.exports = `
type observationTreatment{
  """
  @original-field
  """
  observationTreatmentDbId: ID

"""
  @original-field
  
  """
  factor: String

"""
  @original-field
  
  """
  modality: String

"""
  @original-field
  
  """
  observationUnitDbId: String

observationUnit(search: searchObservationUnitInput): observationUnit
}

type ObservationTreatmentConnection{
edges: [ObservationTreatmentEdge]
pageInfo: pageInfo!
}

type ObservationTreatmentEdge{
cursor: String!
node: observationTreatment!
}

type VueTableObservationTreatment{
  data : [observationTreatment]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum observationTreatmentField {
  observationTreatmentDbId
  factor
  modality
  observationUnitDbId
}

input searchObservationTreatmentInput {
  field: observationTreatmentField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchObservationTreatmentInput]
}

input orderObservationTreatmentInput{
  field: observationTreatmentField
  order: Order
}

type Query {
  readOneObservationTreatment(observationTreatmentDbId: ID!): observationTreatment
  countObservationTreatments(search: searchObservationTreatmentInput ): Int
  vueTableObservationTreatment : VueTableObservationTreatment  csvTableTemplateObservationTreatment: [String]

  observationTreatmentsConnection(search:searchObservationTreatmentInput, order: [ orderObservationTreatmentInput ], pagination: paginationCursorInput ): ObservationTreatmentConnection
}

  type Mutation {
  addObservationTreatment(observationTreatmentDbId: ID!, factor: String, modality: String , addObservationUnit:ID , skipAssociationsExistenceChecks:Boolean = false): observationTreatment!
  updateObservationTreatment(observationTreatmentDbId: ID!, factor: String, modality: String , addObservationUnit:ID, removeObservationUnit:ID  , skipAssociationsExistenceChecks:Boolean = false): observationTreatment!
deleteObservationTreatment(observationTreatmentDbId: ID!): String!
bulkAddObservationTreatmentCsv: [observationTreatment] }

`;