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
    sampling_date: String

    """
    @original-field
    
    """
    type: String

    """
    @original-field
    
    """
    biological_replicate_no: Int

    """
    @original-field
    
    """
    lab_code: String

    """
    @original-field
    
    """
    treatment: String

    """
    @original-field
    
    """
    tissue: String

    """
    @original-field
    
    """
    individual_id: Int

    """
    @original-field
    
    """
    sequencing_experiment_id: Int

    individual(search: searchIndividualInput): individual
  sequencing_experiment(search: searchSequencing_experimentInput): sequencing_experiment
    
    """
    @search-request
    """
    library_dataFilter(search: searchNuc_acid_library_resultInput, order: [ orderNuc_acid_library_resultInput ], pagination: paginationInput): [nuc_acid_library_result]


    """
    @search-request
    """
    library_dataConnection(search: searchNuc_acid_library_resultInput, order: [ orderNuc_acid_library_resultInput ], pagination: paginationCursorInput): Nuc_acid_library_resultConnection

    """
    @count-request
    """
    countFilteredLibrary_data(search: searchNuc_acid_library_resultInput) : Int
  
    """
    @search-request
    """
    transcript_countsFilter(search: searchTranscript_countInput, order: [ orderTranscript_countInput ], pagination: paginationInput): [transcript_count]


    """
    @search-request
    """
    transcript_countsConnection(search: searchTranscript_countInput, order: [ orderTranscript_countInput ], pagination: paginationCursorInput): Transcript_countConnection

    """
    @count-request
    """
    countFilteredTranscript_counts(search: searchTranscript_countInput) : Int
  
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
    sampling_date
    type
    biological_replicate_no
    lab_code
    treatment
    tissue
    individual_id
    sequencing_experiment_id
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
    addSample( name: String, sampling_date: String, type: String, biological_replicate_no: Int, lab_code: String, treatment: String, tissue: String , addIndividual:ID, addSequencing_experiment:ID  , addLibrary_data:[ID], addTranscript_counts:[ID] , skipAssociationsExistenceChecks:Boolean = false): sample!
    updateSample(id: ID!, name: String, sampling_date: String, type: String, biological_replicate_no: Int, lab_code: String, treatment: String, tissue: String , addIndividual:ID, removeIndividual:ID , addSequencing_experiment:ID, removeSequencing_experiment:ID   , addLibrary_data:[ID], removeLibrary_data:[ID] , addTranscript_counts:[ID], removeTranscript_counts:[ID]  , skipAssociationsExistenceChecks:Boolean = false): sample!
  deleteSample(id: ID!): String!
  bulkAddSampleCsv: String! }

`;