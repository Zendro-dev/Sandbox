module.exports = `
  type Plant_variant{
    """
    @original-field
    """
    plant_variant_ID: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    genotype: String

    """
    @original-field
    
    """
    disease_resistances: String

      
    """
    @search-request
    """
    Tomato_measurementsFilter(search: searchTomato_MeasurementInput, order: [ orderTomato_MeasurementInput ], pagination: paginationInput): [Tomato_Measurement]


    """
    @search-request
    """
    Tomato_measurementsConnection(search: searchTomato_MeasurementInput, order: [ orderTomato_MeasurementInput ], pagination: paginationCursorInput): Tomato_MeasurementConnection

    """
    @count-request
    """
    countFilteredTomato_measurements(search: searchTomato_MeasurementInput) : Int
  
    }
type Plant_variantConnection{
  edges: [Plant_variantEdge]
  pageInfo: pageInfo!
}

type Plant_variantEdge{
  cursor: String!
  node: Plant_variant!
}

  type VueTablePlant_variant{
    data : [Plant_variant]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum Plant_variantField {
    plant_variant_ID
    name
    genotype
    disease_resistances
  }
  input searchPlant_variantInput {
    field: Plant_variantField
    value: typeValue
    operator: Operator
    search: [searchPlant_variantInput]
  }

  input orderPlant_variantInput{
    field: Plant_variantField
    order: Order
  }
  type Query {
    plant_variants(search: searchPlant_variantInput, order: [ orderPlant_variantInput ], pagination: paginationInput ): [Plant_variant]
    readOnePlant_variant(plant_variant_ID: ID!): Plant_variant
    countPlant_variants(search: searchPlant_variantInput ): Int
    vueTablePlant_variant : VueTablePlant_variant    csvTableTemplatePlant_variant: [String]

    plant_variantsConnection(search:searchPlant_variantInput, order: [ orderPlant_variantInput ], pagination: paginationCursorInput ): Plant_variantConnection
  }
    type Mutation {
    addPlant_variant(plant_variant_ID: ID!, name: String, genotype: String, disease_resistances: String   , addTomato_measurements:[ID] , skipAssociationsExistenceChecks:Boolean = false): Plant_variant!
    updatePlant_variant(plant_variant_ID: ID!, name: String, genotype: String, disease_resistances: String   , addTomato_measurements:[ID], removeTomato_measurements:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Plant_variant!
  deletePlant_variant(plant_variant_ID: ID!): String!
  bulkAddPlant_variantCsv: String! }

`;