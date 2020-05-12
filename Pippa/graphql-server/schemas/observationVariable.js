module.exports = `
type observationVariable{
  """
  @original-field
  """
  observationVariableDbId: ID

"""
  @original-field
  
  """
  commonCropName: String

"""
  @original-field
  
  """
  defaultValue: String

"""
  @original-field
  
  """
  documentationURL: String

"""
  @original-field
  
  """
  growthStage: String

"""
  @original-field
  
  """
  institution: String

"""
  @original-field
  
  """
  language: String

"""
  @original-field
  
  """
  scientist: String

"""
  @original-field
  
  """
  status: String

"""
  @original-field
  
  """
  submissionTimestamp: DateTime

"""
  @original-field
  
  """
  xref: String

"""
  @original-field
  
  """
  observationVariableName: String

"""
  @original-field
  
  """
  methodDbId: String

"""
  @original-field
  
  """
  scaleDbId: String

"""
  @original-field
  
  """
  traitDbId: String

"""
  @original-field
  
  """
  ontologyDbId: String

method(search: searchMethodInput): method
ontologyReference(search: searchOntologyReferenceInput): ontologyReference
scale(search: searchScaleInput): scale
trait(search: searchTraitInput): trait

  """
  @search-request
  """
  observationsConnection(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationCursorInput): ObservationConnection

  """
  @count-request
  """
  countFilteredObservations(search: searchObservationInput) : Int
}

type ObservationVariableConnection{
edges: [ObservationVariableEdge]
pageInfo: pageInfo!
}

type ObservationVariableEdge{
cursor: String!
node: observationVariable!
}

type VueTableObservationVariable{
  data : [observationVariable]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum observationVariableField {
  observationVariableDbId
  commonCropName
  defaultValue
  documentationURL
  growthStage
  institution
  language
  scientist
  status
  submissionTimestamp
  xref
  observationVariableName
  methodDbId
  scaleDbId
  traitDbId
  ontologyDbId
}

input searchObservationVariableInput {
  field: observationVariableField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchObservationVariableInput]
}

input orderObservationVariableInput{
  field: observationVariableField
  order: Order
}

type Query {
  readOneObservationVariable(observationVariableDbId: ID!): observationVariable
  countObservationVariables(search: searchObservationVariableInput ): Int
  vueTableObservationVariable : VueTableObservationVariable  csvTableTemplateObservationVariable: [String]

  observationVariablesConnection(search:searchObservationVariableInput, order: [ orderObservationVariableInput ], pagination: paginationCursorInput ): ObservationVariableConnection
}

  type Mutation {
  addObservationVariable(observationVariableDbId: ID!, commonCropName: String, defaultValue: String, documentationURL: String, growthStage: String, institution: String, language: String, scientist: String, status: String, submissionTimestamp: DateTime, xref: String, observationVariableName: String , addMethod:ID, addOntologyReference:ID, addScale:ID, addTrait:ID , addObservations:[ID], skipAssociationsExistenceChecks:Boolean = false): observationVariable!
  updateObservationVariable(observationVariableDbId: ID!, commonCropName: String, defaultValue: String, documentationURL: String, growthStage: String, institution: String, language: String, scientist: String, status: String, submissionTimestamp: DateTime, xref: String, observationVariableName: String , addMethod:ID, removeMethod:ID , addOntologyReference:ID, removeOntologyReference:ID , addScale:ID, removeScale:ID , addTrait:ID, removeTrait:ID  , addObservations:[ID], removeObservations:[ID] , skipAssociationsExistenceChecks:Boolean = false): observationVariable!
deleteObservationVariable(observationVariableDbId: ID!): String!
bulkAddObservationVariableCsv: [observationVariable] }

`;