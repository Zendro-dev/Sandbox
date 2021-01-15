module.exports = `
  type plant_measurement{
    """
    @original-field
    """
    measurement_id: ID
    """
    @original-field
    
    """
    plant_id: String

    """
    @original-field
    
    """
    measurement: String

    """
    @original-field
    
    """
    value: String

    """
    @original-field
    
    """
    unit: String

    assay(search: searchAssayInput): assay
    
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
    measurement_id
    plant_id
    measurement
    value
    unit
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

  input bulkAssociationPlant_measurementWithPlant_idInput{
    measurement_id: ID!
    plant_id: ID!
  }

  type Query {
    plant_measurements(search: searchPlant_measurementInput, order: [ orderPlant_measurementInput ], pagination: paginationInput! ): [plant_measurement]
    readOnePlant_measurement(measurement_id: ID!): plant_measurement
    countPlant_measurements(search: searchPlant_measurementInput ): Int
    vueTablePlant_measurement : VueTablePlant_measurement    csvTableTemplatePlant_measurement: [String]
    plant_measurementsConnection(search:searchPlant_measurementInput, order: [ orderPlant_measurementInput ], pagination: paginationCursorInput! ): Plant_measurementConnection
  }

  type Mutation {
    addPlant_measurement(measurement_id: ID!, measurement: String, value: String, unit: String , addAssay:ID   , skipAssociationsExistenceChecks:Boolean = false): plant_measurement!
    updatePlant_measurement(measurement_id: ID!, measurement: String, value: String, unit: String , addAssay:ID, removeAssay:ID    , skipAssociationsExistenceChecks:Boolean = false): plant_measurement!
    deletePlant_measurement(measurement_id: ID!): String!
    bulkAddPlant_measurementCsv: String!
    bulkAssociatePlant_measurementWithPlant_id(bulkAssociationInput: [bulkAssociationPlant_measurementWithPlant_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociatePlant_measurementWithPlant_id(bulkAssociationInput: [bulkAssociationPlant_measurementWithPlant_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;