module.exports = `
  type sample{
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
    material: String

    """
    @original-field
    
    """
    life_cycle_phase: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    harvest_date: Date

    """
    @original-field
    
    """
    library: String

    """
    @original-field
    
    """
    barcode_number: Int

    """
    @original-field
    
    """
    barcode_sequence: String

    """
    @original-field
    
    """
    sample_id: Int

    """
    @original-field
    
    """
    individual_id: Int

    """
    @original-field
    
    """
    pot_id: Int

    """
    @original-field
    
    """
    field_plot_id: Int

    parent(search: searchSampleInput): sample
  individual(search: searchIndividualInput): individual
  pot(search: searchPotInput): pot
  field_plot(search: searchField_plotInput): field_plot
    
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
    microbiome_asvsFilter(search: searchMicrobiome_asvInput, order: [ orderMicrobiome_asvInput ], pagination: paginationInput!): [microbiome_asv]


    """
    @search-request
    """
    microbiome_asvsConnection(search: searchMicrobiome_asvInput, order: [ orderMicrobiome_asvInput ], pagination: paginationCursorInput!): Microbiome_asvConnection

    """
    @count-request
    """
    countFilteredMicrobiome_asvs(search: searchMicrobiome_asvInput) : Int
  
    """
    @search-request
    """
    sample_measurementsFilter(search: searchSample_measurementInput, order: [ orderSample_measurementInput ], pagination: paginationInput!): [sample_measurement]


    """
    @search-request
    """
    sample_measurementsConnection(search: searchSample_measurementInput, order: [ orderSample_measurementInput ], pagination: paginationCursorInput!): Sample_measurementConnection

    """
    @count-request
    """
    countFilteredSample_measurements(search: searchSample_measurementInput) : Int
  
    }
type SampleConnection{
  edges: [SampleEdge]
  pageInfo: pageInfo!
}

type SampleEdge{
  cursor: String!
  node: sample!
}

  type VueTableSample{
    data : [sample]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum sampleField {
    id
    name
    material
    life_cycle_phase
    description
    harvest_date
    library
    barcode_number
    barcode_sequence
    sample_id
    individual_id
    pot_id
    field_plot_id
  }
  input searchSampleInput {
    field: sampleField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchSampleInput]
  }

  input orderSampleInput{
    field: sampleField
    order: Order
  }

  input bulkAssociationSampleWithSample_idInput{
    id: ID!
    sample_id: ID!
  }  input bulkAssociationSampleWithIndividual_idInput{
    id: ID!
    individual_id: ID!
  }  input bulkAssociationSampleWithPot_idInput{
    id: ID!
    pot_id: ID!
  }  input bulkAssociationSampleWithField_plot_idInput{
    id: ID!
    field_plot_id: ID!
  }

  type Query {
    samples(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput! ): [sample]
    readOneSample(id: ID!): sample
    countSamples(search: searchSampleInput ): Int
    vueTableSample : VueTableSample    csvTableTemplateSample: [String]
    samplesConnection(search:searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput! ): SampleConnection
  }

  type Mutation {
    addSample( name: String, material: String, life_cycle_phase: String, description: String, harvest_date: Date, library: String, barcode_number: Int, barcode_sequence: String, sample_id: Int , addParent:ID, addIndividual:ID, addPot:ID, addField_plot:ID  , addSamples:[ID], addMicrobiome_asvs:[ID], addSample_measurements:[ID] , skipAssociationsExistenceChecks:Boolean = false): sample!
    updateSample(id: ID!, name: String, material: String, life_cycle_phase: String, description: String, harvest_date: Date, library: String, barcode_number: Int, barcode_sequence: String, sample_id: Int , addParent:ID, removeParent:ID , addIndividual:ID, removeIndividual:ID , addPot:ID, removePot:ID , addField_plot:ID, removeField_plot:ID   , addSamples:[ID], removeSamples:[ID] , addMicrobiome_asvs:[ID], removeMicrobiome_asvs:[ID] , addSample_measurements:[ID], removeSample_measurements:[ID]  , skipAssociationsExistenceChecks:Boolean = false): sample!
    deleteSample(id: ID!): String!
    bulkAddSampleCsv: String!
    bulkAssociateSampleWithSample_id(bulkAssociationInput: [bulkAssociationSampleWithSample_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateSampleWithSample_id(bulkAssociationInput: [bulkAssociationSampleWithSample_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateSampleWithIndividual_id(bulkAssociationInput: [bulkAssociationSampleWithIndividual_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateSampleWithIndividual_id(bulkAssociationInput: [bulkAssociationSampleWithIndividual_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateSampleWithPot_id(bulkAssociationInput: [bulkAssociationSampleWithPot_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateSampleWithPot_id(bulkAssociationInput: [bulkAssociationSampleWithPot_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateSampleWithField_plot_id(bulkAssociationInput: [bulkAssociationSampleWithField_plot_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateSampleWithField_plot_id(bulkAssociationInput: [bulkAssociationSampleWithField_plot_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;