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

    parent(search: searchSampleInput): sample
    
    """
    @search-request
    """
    samplesFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput): [sample]


    """
    @search-request
    """
    samplesConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput): SampleConnection

    """
    @count-request
    """
    countFilteredSamples(search: searchSampleInput) : Int
  
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
  }
  input searchSampleInput {
    field: sampleField
    value: typeValue
    operator: Operator
    search: [searchSampleInput]
  }

  input orderSampleInput{
    field: sampleField
    order: Order
  }
  type Query {
    samples(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput ): [sample]
    readOneSample(id: ID!): sample
    countSamples(search: searchSampleInput ): Int
    vueTableSample : VueTableSample    csvTableTemplateSample: [String]

    samplesConnection(search:searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput ): SampleConnection
  }
    type Mutation {
    addSample( name: String, material: String, life_cycle_phase: String, description: String, harvest_date: Date, library: String, barcode_number: Int, barcode_sequence: String, sample_id: Int , addParent:ID  , addSamples:[ID] , skipAssociationsExistenceChecks:Boolean = false): sample!
    updateSample(id: ID!, name: String, material: String, life_cycle_phase: String, description: String, harvest_date: Date, library: String, barcode_number: Int, barcode_sequence: String, sample_id: Int , addParent:ID, removeParent:ID   , addSamples:[ID], removeSamples:[ID]  , skipAssociationsExistenceChecks:Boolean = false): sample!
  deleteSample(id: ID!): String!
  bulkAddSampleCsv: String! }

`;