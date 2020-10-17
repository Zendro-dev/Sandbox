module.exports = `
  type plant_measurement{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    variable: String

    """
    @original-field
    
    """
    value: Float

    """
    @original-field
    
    """
    unit: String

    """
    @original-field
    
    """
    individual_id: Int

    individual(search: searchIndividualInput): individual
    
    }
type Plant_measurementConnection{
  edges: [Plant_measurementEdge]
  pageInfo: pageInfo!
}

type Plant_measurementEdge{
  cursor: String!
  node: plant_measurement!
}

  type VueTablePlant_measurement{
    data : [plant_measurement]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum plant_measurementField {
    id
    variable
    value
    unit
    individual_id
  }
  input searchPlant_measurementInput {
    field: plant_measurementField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchPlant_measurementInput]
  }

  input orderPlant_measurementInput{
    field: plant_measurementField
    order: Order
  }

  input bulkAssociationPlant_measurementWithIndividual_idInput{
    id: ID!
    individual_id: ID!
  }

  type Query {
    plant_measurements(search: searchPlant_measurementInput, order: [ orderPlant_measurementInput ], pagination: paginationInput! ): [plant_measurement]
    readOnePlant_measurement(id: ID!): plant_measurement
    countPlant_measurements(search: searchPlant_measurementInput ): Int
    vueTablePlant_measurement : VueTablePlant_measurement    csvTableTemplatePlant_measurement: [String]
    plant_measurementsConnection(search:searchPlant_measurementInput, order: [ orderPlant_measurementInput ], pagination: paginationCursorInput! ): Plant_measurementConnection
  }

  type Mutation {
    addPlant_measurement( variable: String, value: Float, unit: String , addIndividual:ID   , skipAssociationsExistenceChecks:Boolean = false): plant_measurement!
    updatePlant_measurement(id: ID!, variable: String, value: Float, unit: String , addIndividual:ID, removeIndividual:ID    , skipAssociationsExistenceChecks:Boolean = false): plant_measurement!
    deletePlant_measurement(id: ID!): String!
    bulkAddPlant_measurementCsv: String!
    bulkAssociatePlant_measurementWithIndividual_id(bulkAssociationInput: [bulkAssociationPlant_measurementWithIndividual_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociatePlant_measurementWithIndividual_id(bulkAssociationInput: [bulkAssociationPlant_measurementWithIndividual_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;