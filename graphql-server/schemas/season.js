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
    @original-field
    
    """
    studyDbIds: [String]

      
    """
    @search-request
    """
    observationsFilter(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationInput!): [observation]


    """
    @search-request
    """
    observationsConnection(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationCursorInput!): ObservationConnection

    """
    @count-request
    """
    countFilteredObservations(search: searchObservationInput) : Int
  
    """
    @search-request
    """
    studiesFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    studiesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudies(search: searchStudyInput) : Int
  
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
    studyDbIds
  }
  input searchSeasonInput {
    field: seasonField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchSeasonInput]
  }

  input orderSeasonInput{
    field: seasonField
    order: Order
  }



  type Query {
    seasons(search: searchSeasonInput, order: [ orderSeasonInput ], pagination: paginationInput! ): [season]
    readOneSeason(seasonDbId: ID!): season
    countSeasons(search: searchSeasonInput ): Int
    vueTableSeason : VueTableSeason    csvTableTemplateSeason: [String]
    seasonsConnection(search:searchSeasonInput, order: [ orderSeasonInput ], pagination: paginationCursorInput! ): SeasonConnection
  }

  type Mutation {
    addSeason(seasonDbId: ID!, season: String, year: Int   , addObservations:[ID], addStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): season!
    updateSeason(seasonDbId: ID!, season: String, year: Int   , addObservations:[ID], removeObservations:[ID] , addStudies:[ID], removeStudies:[ID]  , skipAssociationsExistenceChecks:Boolean = false): season!
    deleteSeason(seasonDbId: ID!): String!
    bulkAddSeasonCsv: String!
      }
`;