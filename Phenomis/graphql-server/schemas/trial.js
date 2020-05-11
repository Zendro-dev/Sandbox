module.exports = `
type trial{
  """
  @original-field
  """
  trialDbId: ID

"""
  @original-field
  
  """
  active: Boolean

"""
  @original-field
  
  """
  commonCropName: String

"""
  @original-field
  
  """
  documentationURL: String

"""
  @original-field
  
  """
  endDate: DateTime

"""
  @original-field
  
  """
  programDbId: String

"""
  @original-field
  
  """
  startDate: DateTime

"""
  @original-field
  
  """
  trialDescription: String

"""
  @original-field
  
  """
  trialName: String

"""
  @original-field
  
  """
  trialPUI: String

program(search: searchProgramInput): program

  """
  @search-request
  """
  trialToContactsConnection(search: searchTrial_to_contactInput, order: [ orderTrial_to_contactInput ], pagination: paginationCursorInput): Trial_to_contactConnection

  """
  @count-request
  """
  countFilteredTrialToContacts(search: searchTrial_to_contactInput) : Int

  """
  @search-request
  """
  observationUnitsConnection(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationCursorInput): ObservationUnitConnection

  """
  @count-request
  """
  countFilteredObservationUnits(search: searchObservationUnitInput) : Int

  """
  @search-request
  """
  studiesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput): StudyConnection

  """
  @count-request
  """
  countFilteredStudies(search: searchStudyInput) : Int
}

type TrialConnection{
edges: [TrialEdge]
pageInfo: pageInfo!
}

type TrialEdge{
cursor: String!
node: trial!
}

type VueTableTrial{
  data : [trial]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum trialField {
  trialDbId
  active
  commonCropName
  documentationURL
  endDate
  programDbId
  startDate
  trialDescription
  trialName
  trialPUI
}

input searchTrialInput {
  field: trialField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchTrialInput]
}

input orderTrialInput{
  field: trialField
  order: Order
}

type Query {
  trials(search: searchTrialInput, order: [ orderTrialInput ], pagination: paginationInput ): [trial]
  readOneTrial(trialDbId: ID!): trial
  countTrials(search: searchTrialInput ): Int
  vueTableTrial : VueTableTrial  csvTableTemplateTrial: [String]

  trialsConnection(search:searchTrialInput, order: [ orderTrialInput ], pagination: paginationCursorInput ): TrialConnection
}

  type Mutation {
  addTrial(trialDbId: ID!, active: Boolean, commonCropName: String, documentationURL: String, endDate: DateTime, startDate: DateTime, trialDescription: String, trialName: String, trialPUI: String , addProgram:ID , addTrialToContacts:[ID], addObservationUnits:[ID], addStudies:[ID], skipAssociationsExistenceChecks:Boolean = false): trial!
  updateTrial(trialDbId: ID!, active: Boolean, commonCropName: String, documentationURL: String, endDate: DateTime, startDate: DateTime, trialDescription: String, trialName: String, trialPUI: String , addProgram:ID, removeProgram:ID  , addTrialToContacts:[ID], removeTrialToContacts:[ID] , addObservationUnits:[ID], removeObservationUnits:[ID] , addStudies:[ID], removeStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): trial!
deleteTrial(trialDbId: ID!): String!
bulkAddTrialCsv: [trial] }

`;