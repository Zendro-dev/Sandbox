module.exports = `
type season{
  """
  @original-field
  """
  seasonDbId: ID

"""
  @original-field
  
  """
  season: String

"""
  @original-field
  
  """
  year: Int


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
  seasonToStudiesConnection(search: searchStudy_to_seasonInput, order: [ orderStudy_to_seasonInput ], pagination: paginationCursorInput): Study_to_seasonConnection

  """
  @count-request
  """
  countFilteredSeasonToStudies(search: searchStudy_to_seasonInput) : Int
}

type SeasonConnection{
edges: [SeasonEdge]
pageInfo: pageInfo!
}

type SeasonEdge{
cursor: String!
node: season!
}

type VueTableSeason{
  data : [season]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum seasonField {
  seasonDbId
  season
  year
}

input searchSeasonInput {
  field: seasonField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchSeasonInput]
}

input orderSeasonInput{
  field: seasonField
  order: Order
}

type Query {
  seasons(search: searchSeasonInput, order: [ orderSeasonInput ], pagination: paginationInput ): [season]
  readOneSeason(seasonDbId: ID!): season
  countSeasons(search: searchSeasonInput ): Int
  vueTableSeason : VueTableSeason  csvTableTemplateSeason: [String]

  seasonsConnection(search:searchSeasonInput, order: [ orderSeasonInput ], pagination: paginationCursorInput ): SeasonConnection
}

  type Mutation {
  addSeason(seasonDbId: ID!, season: String, year: Int  , addObservations:[ID], addSeasonToStudies:[ID], skipAssociationsExistenceChecks:Boolean = false): season!
  updateSeason(seasonDbId: ID!, season: String, year: Int  , addObservations:[ID], removeObservations:[ID] , addSeasonToStudies:[ID], removeSeasonToStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): season!
deleteSeason(seasonDbId: ID!): String!
bulkAddSeasonCsv: [season] }

`;