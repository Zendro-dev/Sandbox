module.exports = `
type study_to_season{
  """
  @original-field
  """
  id: ID

"""
  @original-field
  
  """
  studyDbId: String

"""
  @original-field
  
  """
  seasonDbId: String

study(search: searchStudyInput): study
season(search: searchSeasonInput): season
}

type Study_to_seasonConnection{
edges: [Study_to_seasonEdge]
pageInfo: pageInfo!
}

type Study_to_seasonEdge{
cursor: String!
node: study_to_season!
}

type VueTableStudy_to_season{
  data : [study_to_season]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum study_to_seasonField {
  id
  studyDbId
  seasonDbId
}

input searchStudy_to_seasonInput {
  field: study_to_seasonField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchStudy_to_seasonInput]
}

input orderStudy_to_seasonInput{
  field: study_to_seasonField
  order: Order
}

type Query {
  readOneStudy_to_season(id: ID!): study_to_season
  countStudy_to_seasons(search: searchStudy_to_seasonInput ): Int
  vueTableStudy_to_season : VueTableStudy_to_season  csvTableTemplateStudy_to_season: [String]

  study_to_seasonsConnection(search:searchStudy_to_seasonInput, order: [ orderStudy_to_seasonInput ], pagination: paginationCursorInput ): Study_to_seasonConnection
}

  type Mutation {
  addStudy_to_season(  , addStudy:ID, addSeason:ID , skipAssociationsExistenceChecks:Boolean = false): study_to_season!
  updateStudy_to_season(id: ID!,  , addStudy:ID, removeStudy:ID , addSeason:ID, removeSeason:ID  , skipAssociationsExistenceChecks:Boolean = false): study_to_season!
deleteStudy_to_season(id: ID!): String!
bulkAddStudy_to_seasonCsv: [study_to_season] }

`;