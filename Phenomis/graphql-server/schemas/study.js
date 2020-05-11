module.exports = `
type study{
  """
  @original-field
  """
  studyDbId: ID

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
  culturalPractices: String

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
  license: String

"""
  @original-field
  
  """
  observationUnitsDescription: String

"""
  @original-field
  
  """
  startDate: DateTime

"""
  @original-field
  
  """
  studyDescription: String

"""
  @original-field
  
  """
  studyName: String

"""
  @original-field
  
  """
  studyType: String

"""
  @original-field
  
  """
  trialDbId: String

"""
  @original-field
  
  """
  locationDbId: String

location(search: searchLocationInput): location
trial(search: searchTrialInput): trial

  """
  @search-request
  """
  studyToContactsConnection(search: searchStudy_to_contactInput, order: [ orderStudy_to_contactInput ], pagination: paginationCursorInput): Study_to_contactConnection

  """
  @count-request
  """
  countFilteredStudyToContacts(search: searchStudy_to_contactInput) : Int

  """
  @search-request
  """
  environmentParametersConnection(search: searchEnvironmentParameterInput, order: [ orderEnvironmentParameterInput ], pagination: paginationCursorInput): EnvironmentParameterConnection

  """
  @count-request
  """
  countFilteredEnvironmentParameters(search: searchEnvironmentParameterInput) : Int

  """
  @search-request
  """
  studyToSeasonsConnection(search: searchStudy_to_seasonInput, order: [ orderStudy_to_seasonInput ], pagination: paginationCursorInput): Study_to_seasonConnection

  """
  @count-request
  """
  countFilteredStudyToSeasons(search: searchStudy_to_seasonInput) : Int

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
  observationsConnection(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationCursorInput): ObservationConnection

  """
  @count-request
  """
  countFilteredObservations(search: searchObservationInput) : Int

  """
  @search-request
  """
  eventsConnection(search: searchEventInput, order: [ orderEventInput ], pagination: paginationCursorInput): EventConnection

  """
  @count-request
  """
  countFilteredEvents(search: searchEventInput) : Int
}

type StudyConnection{
edges: [StudyEdge]
pageInfo: pageInfo!
}

type StudyEdge{
cursor: String!
node: study!
}

type VueTableStudy{
  data : [study]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum studyField {
  studyDbId
  active
  commonCropName
  culturalPractices
  documentationURL
  endDate
  license
  observationUnitsDescription
  startDate
  studyDescription
  studyName
  studyType
  trialDbId
  locationDbId
}

input searchStudyInput {
  field: studyField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchStudyInput]
}

input orderStudyInput{
  field: studyField
  order: Order
}

type Query {
  studies(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput ): [study]
  readOneStudy(studyDbId: ID!): study
  countStudies(search: searchStudyInput ): Int
  vueTableStudy : VueTableStudy  csvTableTemplateStudy: [String]

  studiesConnection(search:searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput ): StudyConnection
}

  type Mutation {
  addStudy(studyDbId: ID!, active: Boolean, commonCropName: String, culturalPractices: String, documentationURL: String, endDate: DateTime, license: String, observationUnitsDescription: String, startDate: DateTime, studyDescription: String, studyName: String, studyType: String , addLocation:ID, addTrial:ID , addStudyToContacts:[ID], addEnvironmentParameters:[ID], addStudyToSeasons:[ID], addObservationUnits:[ID], addObservations:[ID], addEvents:[ID], skipAssociationsExistenceChecks:Boolean = false): study!
  updateStudy(studyDbId: ID!, active: Boolean, commonCropName: String, culturalPractices: String, documentationURL: String, endDate: DateTime, license: String, observationUnitsDescription: String, startDate: DateTime, studyDescription: String, studyName: String, studyType: String , addLocation:ID, removeLocation:ID , addTrial:ID, removeTrial:ID  , addStudyToContacts:[ID], removeStudyToContacts:[ID] , addEnvironmentParameters:[ID], removeEnvironmentParameters:[ID] , addStudyToSeasons:[ID], removeStudyToSeasons:[ID] , addObservationUnits:[ID], removeObservationUnits:[ID] , addObservations:[ID], removeObservations:[ID] , addEvents:[ID], removeEvents:[ID] , skipAssociationsExistenceChecks:Boolean = false): study!
deleteStudy(studyDbId: ID!): String!
bulkAddStudyCsv: [study] }

`;