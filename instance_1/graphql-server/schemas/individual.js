module.exports = `
  type individual{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    sowing_date: Date

    """
    @original-field
    
    """
    harvest_date: Date

    """
    @original-field
    
    """
    developmental_state: String

    """
    @original-field
    
    """
    life_cycle_phase: String

    """
    @original-field
    
    """
    location_type: String

    """
    @original-field
    
    """
    cultivar_id: Int

    """
    @original-field
    
    """
    field_plot_id: Int

    """
    @original-field
    
    """
    pot_id: Int

    cultivar(search: searchCultivarInput): cultivar
  field_plot(search: searchField_plotInput): field_plot
  pot(search: searchPotInput): pot
    
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
  
    """
    @search-request
    """
    plant_measurementsFilter(search: searchPlant_measurementInput, order: [ orderPlant_measurementInput ], pagination: paginationInput!): [plant_measurement]


    """
    @search-request
    """
    plant_measurementsConnection(search: searchPlant_measurementInput, order: [ orderPlant_measurementInput ], pagination: paginationCursorInput!): Plant_measurementConnection

    """
    @count-request
    """
    countFilteredPlant_measurements(search: searchPlant_measurementInput) : Int
  
    """
    @search-request
    """
    transcript_countsFilter(search: searchTranscript_countInput, order: [ orderTranscript_countInput ], pagination: paginationInput!): [transcript_count]


    """
    @search-request
    """
    transcript_countsConnection(search: searchTranscript_countInput, order: [ orderTranscript_countInput ], pagination: paginationCursorInput!): Transcript_countConnection

    """
    @count-request
    """
    countFilteredTranscript_counts(search: searchTranscript_countInput) : Int
  
    }
type IndividualConnection{
  edges: [IndividualEdge]
  pageInfo: pageInfo!
}

type IndividualEdge{
  cursor: String!
  node: individual!
}

  type VueTableIndividual{
    data : [individual]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum individualField {
    id
    name
    sowing_date
    harvest_date
    developmental_state
    life_cycle_phase
    location_type
    cultivar_id
    field_plot_id
    pot_id
  }
  input searchIndividualInput {
    field: individualField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchIndividualInput]
  }

  input orderIndividualInput{
    field: individualField
    order: Order
  }

  input bulkAssociationIndividualWithCultivar_idInput{
    id: ID!
    cultivar_id: ID!
  }  input bulkAssociationIndividualWithField_plot_idInput{
    id: ID!
    field_plot_id: ID!
  }  input bulkAssociationIndividualWithPot_idInput{
    id: ID!
    pot_id: ID!
  }

  type Query {
    individuals(search: searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationInput! ): [individual]
    readOneIndividual(id: ID!): individual
    countIndividuals(search: searchIndividualInput ): Int
    vueTableIndividual : VueTableIndividual    csvTableTemplateIndividual: [String]
    individualsConnection(search:searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationCursorInput! ): IndividualConnection
  }

  type Mutation {
    addIndividual( name: String, sowing_date: Date, harvest_date: Date, developmental_state: String, life_cycle_phase: String, location_type: String , addCultivar:ID, addField_plot:ID, addPot:ID  , addSamples:[ID], addPlant_measurements:[ID], addTranscript_counts:[ID] , skipAssociationsExistenceChecks:Boolean = false): individual!
    updateIndividual(id: ID!, name: String, sowing_date: Date, harvest_date: Date, developmental_state: String, life_cycle_phase: String, location_type: String , addCultivar:ID, removeCultivar:ID , addField_plot:ID, removeField_plot:ID , addPot:ID, removePot:ID   , addSamples:[ID], removeSamples:[ID] , addPlant_measurements:[ID], removePlant_measurements:[ID] , addTranscript_counts:[ID], removeTranscript_counts:[ID]  , skipAssociationsExistenceChecks:Boolean = false): individual!
    deleteIndividual(id: ID!): String!
    bulkAddIndividualCsv: String!
    bulkAssociateIndividualWithCultivar_id(bulkAssociationInput: [bulkAssociationIndividualWithCultivar_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateIndividualWithCultivar_id(bulkAssociationInput: [bulkAssociationIndividualWithCultivar_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateIndividualWithField_plot_id(bulkAssociationInput: [bulkAssociationIndividualWithField_plot_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateIndividualWithField_plot_id(bulkAssociationInput: [bulkAssociationIndividualWithField_plot_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateIndividualWithPot_id(bulkAssociationInput: [bulkAssociationIndividualWithPot_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateIndividualWithPot_id(bulkAssociationInput: [bulkAssociationIndividualWithPot_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;