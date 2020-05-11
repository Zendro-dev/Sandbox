module.exports = `
type program{
  """
  @original-field
  """
  programDbId: ID

"""
  @original-field
  
  """
  abbreviation: String

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
  leadPersonDbId: String

"""
  @original-field
  
  """
  leadPersonName: String

"""
  @original-field
  
  """
  objective: String

"""
  @original-field
  
  """
  programName: String


  """
  @search-request
  """
  trialsConnection(search: searchTrialInput, order: [ orderTrialInput ], pagination: paginationCursorInput): TrialConnection

  """
  @count-request
  """
  countFilteredTrials(search: searchTrialInput) : Int

  """
  @search-request
  """
  observationUnitsConnection(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationCursorInput): ObservationUnitConnection

  """
  @count-request
  """
  countFilteredObservationUnits(search: searchObservationUnitInput) : Int
}

type ProgramConnection{
edges: [ProgramEdge]
pageInfo: pageInfo!
}

type ProgramEdge{
cursor: String!
node: program!
}

type VueTableProgram{
  data : [program]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum programField {
  programDbId
  abbreviation
  commonCropName
  documentationURL
  leadPersonDbId
  leadPersonName
  objective
  programName
}

input searchProgramInput {
  field: programField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchProgramInput]
}

input orderProgramInput{
  field: programField
  order: Order
}

type Query {
  programs(search: searchProgramInput, order: [ orderProgramInput ], pagination: paginationInput ): [program]
  readOneProgram(programDbId: ID!): program
  countPrograms(search: searchProgramInput ): Int
  vueTableProgram : VueTableProgram  csvTableTemplateProgram: [String]

  programsConnection(search:searchProgramInput, order: [ orderProgramInput ], pagination: paginationCursorInput ): ProgramConnection
}

  type Mutation {
  addProgram(programDbId: ID!, abbreviation: String, commonCropName: String, documentationURL: String, leadPersonDbId: String, leadPersonName: String, objective: String, programName: String  , addTrials:[ID], addObservationUnits:[ID], skipAssociationsExistenceChecks:Boolean = false): program!
  updateProgram(programDbId: ID!, abbreviation: String, commonCropName: String, documentationURL: String, leadPersonDbId: String, leadPersonName: String, objective: String, programName: String  , addTrials:[ID], removeTrials:[ID] , addObservationUnits:[ID], removeObservationUnits:[ID] , skipAssociationsExistenceChecks:Boolean = false): program!
deleteProgram(programDbId: ID!): String!
bulkAddProgramCsv: [program] }

`;