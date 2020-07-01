module.exports = `
  type Tomato_Measurement{
    """
    @original-field
    """
    tomato_ID: ID
    """
    @original-field
    
    """
    no_fruit: Int

    """
    @original-field
    
    """
    sugar_content: Float

    """
    @original-field
    
    """
    plant_variant_ID: String

    Plant_variant(search: searchPlant_variantInput): Plant_variant
    
    }
type Tomato_MeasurementConnection{
  edges: [Tomato_MeasurementEdge]
  pageInfo: pageInfo!
}

type Tomato_MeasurementEdge{
  cursor: String!
  node: Tomato_Measurement!
}

  type VueTableTomato_Measurement{
    data : [Tomato_Measurement]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum Tomato_MeasurementField {
    tomato_ID
    no_fruit
    sugar_content
    plant_variant_ID
  }
  input searchTomato_MeasurementInput {
    field: Tomato_MeasurementField
    value: typeValue
    operator: Operator
    search: [searchTomato_MeasurementInput]
  }

  input orderTomato_MeasurementInput{
    field: Tomato_MeasurementField
    order: Order
  }
  type Query {
    tomato_Measurements(search: searchTomato_MeasurementInput, order: [ orderTomato_MeasurementInput ], pagination: paginationInput ): [Tomato_Measurement]
    readOneTomato_Measurement(tomato_ID: ID!): Tomato_Measurement
    countTomato_Measurements(search: searchTomato_MeasurementInput ): Int
    vueTableTomato_Measurement : VueTableTomato_Measurement    csvTableTemplateTomato_Measurement: [String]

    tomato_MeasurementsConnection(search:searchTomato_MeasurementInput, order: [ orderTomato_MeasurementInput ], pagination: paginationCursorInput ): Tomato_MeasurementConnection
  }
    type Mutation {
    addTomato_Measurement(tomato_ID: ID!, no_fruit: Int, sugar_content: Float , addPlant_variant:ID   , skipAssociationsExistenceChecks:Boolean = false): Tomato_Measurement!
    updateTomato_Measurement(tomato_ID: ID!, no_fruit: Int, sugar_content: Float , addPlant_variant:ID, removePlant_variant:ID    , skipAssociationsExistenceChecks:Boolean = false): Tomato_Measurement!
  deleteTomato_Measurement(tomato_ID: ID!): String!
  bulkAddTomato_MeasurementCsv: String! }

`;