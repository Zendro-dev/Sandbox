module.exports = `
  type field_plot{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    field_name: String

    """
    @original-field
    
    """
    latitude: Float

    """
    @original-field
    
    """
    longitude: Float

    """
    @original-field
    
    """
    location_code: String

    """
    @original-field
    
    """
    soil_treatment: String

      
    """
    @search-request
    """
    individualsFilter(search: searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationInput!): [individual]


    """
    @search-request
    """
    individualsConnection(search: searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationCursorInput!): IndividualConnection

    """
    @count-request
    """
    countFilteredIndividuals(search: searchIndividualInput) : Int
  
    """
    @search-request
    """
    samplesFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput!): [sample]


    """
    @search-request
    """
    samplesConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput!): SampleConnection

    """
    @count-request
    """
    countFilteredSamples(search: searchSampleInput) : Int
  
    }
type Field_plotConnection{
  edges: [Field_plotEdge]
  pageInfo: pageInfo!
}

type Field_plotEdge{
  cursor: String!
  node: field_plot!
}

  type VueTableField_plot{
    data : [field_plot]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum field_plotField {
    id
    field_name
    latitude
    longitude
    location_code
    soil_treatment
  }
  input searchField_plotInput {
    field: field_plotField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchField_plotInput]
  }

  input orderField_plotInput{
    field: field_plotField
    order: Order
  }



  type Query {
    field_plots(search: searchField_plotInput, order: [ orderField_plotInput ], pagination: paginationInput! ): [field_plot]
    readOneField_plot(id: ID!): field_plot
    countField_plots(search: searchField_plotInput ): Int
    vueTableField_plot : VueTableField_plot    csvTableTemplateField_plot: [String]
    field_plotsConnection(search:searchField_plotInput, order: [ orderField_plotInput ], pagination: paginationCursorInput! ): Field_plotConnection
  }

  type Mutation {
    addField_plot( field_name: String, latitude: Float, longitude: Float, location_code: String, soil_treatment: String   , addIndividuals:[ID], addSamples:[ID] , skipAssociationsExistenceChecks:Boolean = false): field_plot!
    updateField_plot(id: ID!, field_name: String, latitude: Float, longitude: Float, location_code: String, soil_treatment: String   , addIndividuals:[ID], removeIndividuals:[ID] , addSamples:[ID], removeSamples:[ID]  , skipAssociationsExistenceChecks:Boolean = false): field_plot!
    deleteField_plot(id: ID!): String!
    bulkAddField_plotCsv: String!
      }
`;