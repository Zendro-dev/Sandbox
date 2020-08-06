module.exports = `
  type sample_string{
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
    sample_id: String

    parent(search: searchSample_stringInput): sample_string
    
    """
    @search-request
    """
    samplesFilter(search: searchSample_stringInput, order: [ orderSample_stringInput ], pagination: paginationInput): [sample_string]


    """
    @search-request
    """
    samplesConnection(search: searchSample_stringInput, order: [ orderSample_stringInput ], pagination: paginationCursorInput): Sample_stringConnection

    """
    @count-request
    """
    countFilteredSamples(search: searchSample_stringInput) : Int
  
    }
type Sample_stringConnection{
  edges: [Sample_stringEdge]
  pageInfo: pageInfo!
}

type Sample_stringEdge{
  cursor: String!
  node: sample_string!
}

  type VueTableSample_string{
    data : [sample_string]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum sample_stringField {
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
  input searchSample_stringInput {
    field: sample_stringField
    value: typeValue
    operator: Operator
    search: [searchSample_stringInput]
  }

  input orderSample_stringInput{
    field: sample_stringField
    order: Order
  }
  type Query {
    sample_strings(search: searchSample_stringInput, order: [ orderSample_stringInput ], pagination: paginationInput ): [sample_string]
    readOneSample_string(id: ID!): sample_string
    countSample_strings(search: searchSample_stringInput ): Int
    vueTableSample_string : VueTableSample_string    csvTableTemplateSample_string: [String]

    sample_stringsConnection(search:searchSample_stringInput, order: [ orderSample_stringInput ], pagination: paginationCursorInput ): Sample_stringConnection
  }
    type Mutation {
    addSample_string(id: ID!, name: String, material: String, life_cycle_phase: String, description: String, harvest_date: Date, library: String, barcode_number: Int, barcode_sequence: String, sample_id: String , addParent:ID  , addSamples:[ID] , skipAssociationsExistenceChecks:Boolean = false): sample_string!
    updateSample_string(id: ID!, name: String, material: String, life_cycle_phase: String, description: String, harvest_date: Date, library: String, barcode_number: Int, barcode_sequence: String, sample_id: String , addParent:ID, removeParent:ID   , addSamples:[ID], removeSamples:[ID]  , skipAssociationsExistenceChecks:Boolean = false): sample_string!
  deleteSample_string(id: ID!): String!
  bulkAddSample_stringCsv: String! }

`;