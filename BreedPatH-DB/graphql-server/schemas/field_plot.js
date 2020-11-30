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
    coordinates_or_name: String

    """
    @original-field
    
    """
    year: String

    """
    @original-field
    
    """
    area_sqm: Float

    """
    @original-field
    
    """
    type: String

    """
    @original-field
    
    """
    genotype_id: Int

    genotype(search: searchGenotypeInput): genotype
    
    """
    @search-request
    """
    field_plot_treatmentFilter(search: searchField_plot_treatmentInput, order: [ orderField_plot_treatmentInput ], pagination: paginationInput): [field_plot_treatment]


    """
    @search-request
    """
    field_plot_treatmentConnection(search: searchField_plot_treatmentInput, order: [ orderField_plot_treatmentInput ], pagination: paginationCursorInput): Field_plot_treatmentConnection

    """
    @count-request
    """
    countFilteredField_plot_treatment(search: searchField_plot_treatmentInput) : Int
  
    """
    @search-request
    """
    measurementsFilter(search: searchMeasurementInput, order: [ orderMeasurementInput ], pagination: paginationInput): [measurement]


    """
    @search-request
    """
    measurementsConnection(search: searchMeasurementInput, order: [ orderMeasurementInput ], pagination: paginationCursorInput): MeasurementConnection

    """
    @count-request
    """
    countFilteredMeasurements(search: searchMeasurementInput) : Int
  
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
    coordinates_or_name
    year
    area_sqm
    type
    genotype_id
  }
  input searchField_plotInput {
    field: field_plotField
    value: typeValue
    operator: Operator
    search: [searchField_plotInput]
  }

  input orderField_plotInput{
    field: field_plotField
    order: Order
  }
  type Query {
    field_plots(search: searchField_plotInput, order: [ orderField_plotInput ], pagination: paginationInput ): [field_plot]
    readOneField_plot(id: ID!): field_plot
    countField_plots(search: searchField_plotInput ): Int
    vueTableField_plot : VueTableField_plot    csvTableTemplateField_plot: [String]

    field_plotsConnection(search:searchField_plotInput, order: [ orderField_plotInput ], pagination: paginationCursorInput ): Field_plotConnection
  }
    type Mutation {
    addField_plot( field_name: String, coordinates_or_name: String, year: String, area_sqm: Float, type: String , addGenotype:ID  , addField_plot_treatment:[ID], addMeasurements:[ID] , skipAssociationsExistenceChecks:Boolean = false): field_plot!
    updateField_plot(id: ID!, field_name: String, coordinates_or_name: String, year: String, area_sqm: Float, type: String , addGenotype:ID, removeGenotype:ID   , addField_plot_treatment:[ID], removeField_plot_treatment:[ID] , addMeasurements:[ID], removeMeasurements:[ID]  , skipAssociationsExistenceChecks:Boolean = false): field_plot!
  deleteField_plot(id: ID!): String!
  bulkAddField_plotCsv: String! }

`;