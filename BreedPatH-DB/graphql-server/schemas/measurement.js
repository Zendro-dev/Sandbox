module.exports = `
  type measurement{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    method: String

    """
    @original-field
    
    """
    reference: String

    """
    @original-field
    
    """
    float_value: Float

    """
    @original-field
    
    """
    int_value: Int

    """
    @original-field
    
    """
    text_value: String

    """
    @original-field
    
    """
    unit: String

    """
    @original-field
    
    """
    field_plot_id: Int

    field_plot(search: searchField_plotInput): field_plot
    
    }
type MeasurementConnection{
  edges: [MeasurementEdge]
  pageInfo: pageInfo!
}

type MeasurementEdge{
  cursor: String!
  node: measurement!
}

  type VueTableMeasurement{
    data : [measurement]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum measurementField {
    id
    method
    reference
    float_value
    int_value
    text_value
    unit
    field_plot_id
  }
  input searchMeasurementInput {
    field: measurementField
    value: typeValue
    operator: Operator
    search: [searchMeasurementInput]
  }

  input orderMeasurementInput{
    field: measurementField
    order: Order
  }
  type Query {
    measurements(search: searchMeasurementInput, order: [ orderMeasurementInput ], pagination: paginationInput ): [measurement]
    readOneMeasurement(id: ID!): measurement
    countMeasurements(search: searchMeasurementInput ): Int
    vueTableMeasurement : VueTableMeasurement    csvTableTemplateMeasurement: [String]

    measurementsConnection(search:searchMeasurementInput, order: [ orderMeasurementInput ], pagination: paginationCursorInput ): MeasurementConnection
  }
    type Mutation {
    addMeasurement( method: String, reference: String, float_value: Float, int_value: Int, text_value: String, unit: String , addField_plot:ID   , skipAssociationsExistenceChecks:Boolean = false): measurement!
    updateMeasurement(id: ID!, method: String, reference: String, float_value: Float, int_value: Int, text_value: String, unit: String , addField_plot:ID, removeField_plot:ID    , skipAssociationsExistenceChecks:Boolean = false): measurement!
  deleteMeasurement(id: ID!): String!
  bulkAddMeasurementCsv: String! }

`;